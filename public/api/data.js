// Vercel Serverless Function: /api/data
// Centralized shared transaction & alert configuration store for Transact Bridge Team Monitoring

let inMemoryStore = null;
let inMemoryAlertSettings = null;

const NTFY_TXS_TOPIC = 'https://ntfy.sh/tb_shared_txs_transactbridge_v1';
const NTFY_ALERTS_TOPIC = 'https://ntfy.sh/tb_shared_alerts_transactbridge_v1';

// Universal helper for Upstash Redis / Vercel KV REST API commands
async function upstashCommand(kvUrl, kvToken, commandArray, timeoutMs = 3500) {
  if (!kvUrl || !kvToken) return null;
  let cleanUrl = kvUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  cleanUrl = cleanUrl.replace(/\/+$/, '');

  // Format 1: Official Upstash body-style REST API (POST ["CMD", "arg1", ...])
  try {
    const res = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandArray),
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Upstash body command failed:', err.message);
  }

  // Format 2: Fallback GET /get/key
  if (commandArray[0] === 'GET') {
    try {
      const res = await fetch(`${cleanUrl}/get/${encodeURIComponent(commandArray[1])}`, {
        headers: { Authorization: `Bearer ${kvToken.trim()}` },
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  // Format 3: Fallback POST /set/key
  if (commandArray[0] === 'SET') {
    try {
      const res = await fetch(`${cleanUrl}/set/${encodeURIComponent(commandArray[1])}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: typeof commandArray[2] === 'string' ? commandArray[2] : JSON.stringify(commandArray[2]),
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  return null;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).end();
  }

  // Resolve all possible Upstash / Vercel KV environment variables
  let kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.STORAGE_REST_API_URL;
  if (!kvUrl) {
    const rawUrl = process.env.KV_URL || process.env.STORAGE_URL || process.env.UPSTASH_REDIS_URL;
    if (rawUrl && (rawUrl.startsWith('https://') || rawUrl.startsWith('http://'))) {
      kvUrl = rawUrl;
    }
  }

  const kvToken = process.env.KV_REST_API_TOKEN || 
                  process.env.UPSTASH_REDIS_REST_TOKEN || 
                  process.env.STORAGE_REST_API_TOKEN || 
                  process.env.KV_TOKEN || 
                  process.env.STORAGE_TOKEN || 
                  process.env.UPSTASH_REDIS_TOKEN;

  // Handle Diagnostic Query (?diag=1)
  if (req.method === 'GET' && req.query && req.query.diag) {
    const detectedEnvKeys = Object.keys(process.env).filter(k => 
      k.includes('KV') || k.includes('UPSTASH') || k.includes('STORAGE') || k.includes('REDIS')
    );
    let kvPing = null;
    let kvHost = null;
    if (kvUrl) {
      try {
        const u = new URL(kvUrl.startsWith('http') ? kvUrl : `https://${kvUrl}`);
        kvHost = u.hostname;
      } catch (_) {}
    }
    if (kvUrl && kvToken) {
      try {
        const p = await upstashCommand(kvUrl, kvToken, ['PING'], 2500);
        kvPing = p ? (p.result || 'OK') : 'NO_RESPONSE';
      } catch (e) {
        kvPing = 'ERR: ' + e.message;
      }
    }
    return res.status(200).json({
      success: true,
      status: 'healthy',
      hasKvUrl: Boolean(kvUrl),
      kvHost,
      hasKvToken: Boolean(kvToken),
      kvPing,
      detectedEnvKeys,
      hasInMemoryBatch: Boolean(inMemoryStore),
      activeBatchName: inMemoryStore ? (inMemoryStore.name || 'Shared Batch') : null,
      activeBatchCount: inMemoryStore ? (inMemoryStore.count || inMemoryStore.transactions?.length || 0) : 0,
      hasInMemoryAlerts: Boolean(inMemoryAlertSettings),
      timestamp: new Date().toISOString()
    });
  }

  // Handle GET - Fetch latest shared transaction batch or alert configuration
  if (req.method === 'GET') {
    try {
      const isAlertQuery = req.query && req.query.type === 'alert_settings';

      // 1. Fetch Alert Settings if specifically requested
      if (isAlertQuery) {
        if (inMemoryAlertSettings) {
          return res.status(200).json({ success: true, source: 'memory', alertSettings: inMemoryAlertSettings });
        }
        if (kvUrl && kvToken) {
          const kvRes = await upstashCommand(kvUrl, kvToken, ['GET', 'tb_shared_alert_settings_latest'], 3000);
          if (kvRes && kvRes.result) {
            const parsed = typeof kvRes.result === 'string' ? JSON.parse(kvRes.result) : kvRes.result;
            inMemoryAlertSettings = parsed;
            return res.status(200).json({ success: true, source: 'vercel_kv', alertSettings: parsed });
          }
        }
        return res.status(200).json({ success: true, source: 'none', alertSettings: null });
      }

      // 2. Fetch shared transaction batch & include latest alert settings
      let batchData = inMemoryStore;

      if (!batchData && kvUrl && kvToken) {
        const kvRes = await upstashCommand(kvUrl, kvToken, ['GET', 'tb_shared_transactions_latest'], 3500);
        if (kvRes && kvRes.result) {
          batchData = typeof kvRes.result === 'string' ? JSON.parse(kvRes.result) : kvRes.result;
          inMemoryStore = batchData;
        }
      }

      // Attempt to load alert settings if not already cached
      if (!inMemoryAlertSettings && kvUrl && kvToken) {
        const kvAlertRes = await upstashCommand(kvUrl, kvToken, ['GET', 'tb_shared_alert_settings_latest'], 2000);
        if (kvAlertRes && kvAlertRes.result) {
          inMemoryAlertSettings = typeof kvAlertRes.result === 'string' ? JSON.parse(kvAlertRes.result) : kvAlertRes.result;
        }
      }

      if (batchData) {
        const payloadToSend = { ...batchData };
        if (inMemoryAlertSettings) {
          payloadToSend.alertSettings = inMemoryAlertSettings;
        }
        return res.status(200).json({ 
          success: true, 
          source: kvUrl && kvToken ? 'vercel_kv' : 'memory', 
          data: payloadToSend, 
          alertSettings: inMemoryAlertSettings 
        });
      }

      return res.status(200).json({
        success: true,
        source: 'none',
        data: null,
        alertSettings: inMemoryAlertSettings,
        message: 'No uploaded team data yet. Dashboard in clean empty state.'
      });
    } catch (err) {
      console.error('Error fetching shared data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Handle POST - Save newly uploaded batch or alert configuration from Admin
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }

      if (!body) {
        return res.status(400).json({ success: false, error: 'Empty request body.' });
      }

      // 0. Dedicated Clear Action (Remove all shared data)
      if (body.clear === true || body.action === 'clear') {
        inMemoryStore = null;
        if (kvUrl && kvToken) {
          try {
            await upstashCommand(kvUrl, kvToken, ['DEL', 'tb_shared_transactions_latest'], 3000);
          } catch (_) {}
        }
        try {
          fetch(NTFY_TXS_TOPIC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Title': 'Team Data Cleared' },
            body: JSON.stringify({ action: 'batch_cleared', timestamp: new Date().toISOString() })
          }).catch(() => {});
        } catch (_) {}
        return res.status(200).json({ success: true, message: 'All shared team data cleared. Dashboard in clean empty state.' });
      }

      // 1. Dedicated Alert Configuration Save
      if (body.type === 'alert_settings' || (body.alertSettings && !body.batch)) {
        const settings = body.alertSettings;
        if (inMemoryAlertSettings && inMemoryAlertSettings.emailjs) {
          const oldEj = inMemoryAlertSettings.emailjs;
          const newEj = settings.emailjs || {};
          settings.emailjs = {
            serviceId: newEj.serviceId || oldEj.serviceId || '',
            templateId: newEj.templateId || oldEj.templateId || '',
            publicKey: newEj.publicKey || oldEj.publicKey || ''
          };
        }
        inMemoryAlertSettings = settings;

        if (inMemoryStore) {
          inMemoryStore.alertSettings = settings;
        }

        const persistPromises = [];

        // Persist to Upstash Redis / Vercel KV if available
        let kvSaved = false;
        if (kvUrl && kvToken) {
          persistPromises.push(
            upstashCommand(kvUrl, kvToken, ['SET', 'tb_shared_alert_settings_latest', JSON.stringify(settings)], 3500)
              .then(res => { if (res && res.result === 'OK') kvSaved = true; })
              .catch(e => console.warn('KV alert save error:', e.message))
          );
        }

        // Broadcast lightweight alert update notification via SSE
        persistPromises.push(
          fetch(NTFY_ALERTS_TOPIC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Title': 'Alert Settings Updated' },
            body: JSON.stringify({ 
              action: 'alert_settings_updated', 
              updatedAt: new Date().toISOString(),
              thresholds: settings.thresholds || null 
            }),
            signal: AbortSignal.timeout(3000)
          }).catch(() => {})
        );

        await Promise.allSettled(persistPromises);

        return res.status(200).json({
          success: true,
          message: 'Alert configuration saved and broadcast to team cloud!',
          alertSettings: settings,
          kvSaved,
          updatedAt: new Date().toISOString()
        });
      }

      // 2. Transaction Batch Upload
      if (!body.batch) {
        return res.status(400).json({ success: false, error: 'Missing batch data in request body.' });
      }

      const payload = {
        id: body.batch.id || ('batch_' + Date.now()),
        name: body.batch.name || 'Shared Team Batch',
        uploadedAt: body.batch.uploadedAt || new Date().toISOString(),
        uploadedBy: body.uploadedBy || 'Admin',
        count: body.batch.count || (body.batch.transactions ? body.batch.transactions.length : 0),
        transactions: body.batch.transactions || [],
        aggregates: body.aggregates || null,
        alertSettings: body.alertSettings || inMemoryAlertSettings || null,
        updatedAt: new Date().toISOString()
      };

      if (body.alertSettings) {
        inMemoryAlertSettings = body.alertSettings;
      }

      // Always update in-memory cache
      inMemoryStore = payload;

      const persistPromises = [];
      let kvSaved = false;

      // Persist batch to Upstash Redis / Vercel KV if configured
      if (kvUrl && kvToken) {
        persistPromises.push(
          upstashCommand(kvUrl, kvToken, ['SET', 'tb_shared_transactions_latest', JSON.stringify(payload)], 4000)
            .then(res => { if (res && res.result === 'OK') kvSaved = true; })
            .catch(e => console.warn('Failed to persist to Upstash:', e.message))
        );
      }

      // Broadcast lightweight SSE invalidation signal (< 300 bytes) so ntfy never drops it
      persistPromises.push(
        fetch(NTFY_TXS_TOPIC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Title': 'Team Ingestion Synced' },
          body: JSON.stringify({
            action: 'batch_updated',
            batchId: payload.id,
            count: payload.count,
            uploadedBy: payload.uploadedBy,
            timestamp: payload.uploadedAt
          }),
          signal: AbortSignal.timeout(3000)
        }).catch(() => {})
      );

      await Promise.allSettled(persistPromises);

      return res.status(200).json({
        success: true,
        message: `Successfully published batch with ${payload.count} transactions to shared team cloud!`,
        batchId: payload.id,
        uploadedAt: payload.uploadedAt,
        kvSaved,
        alertSettings: inMemoryAlertSettings
      });
    } catch (err) {
      console.error('Error saving shared data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
