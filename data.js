// Vercel Serverless Function: /api/data
// Centralized shared transaction & alert configuration store for Transact Bridge Team Monitoring

let inMemoryStore = null;
let inMemoryAlertSettings = null;

const NTFY_TXS_TOPIC = 'https://ntfy.sh/tb_shared_txs_transactbridge_v1';
const NTFY_ALERTS_TOPIC = 'https://ntfy.sh/tb_shared_alerts_transactbridge_v1';

// Helper for Upstash Redis / Vercel KV REST API commands
async function upstashCommand(kvUrl, kvToken, commandArray, timeoutMs = 3500) {
  if (!kvUrl || !kvToken) return null;
  // Format 1: Official Upstash body-style REST API (POST ["CMD", "arg1", ...])
  try {
    const res = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
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
      const res = await fetch(`${kvUrl}/get/${encodeURIComponent(commandArray[1])}`, {
        headers: { Authorization: `Bearer ${kvToken}` },
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

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
        // Cloud Relay Fallback
        try {
          const ntfyRes = await fetch(`${NTFY_ALERTS_TOPIC}/json?poll=1`, {
            signal: AbortSignal.timeout(3000)
          });
          if (ntfyRes.ok) {
            const text = await ntfyRes.text();
            const lines = text.trim().split('\n').filter(Boolean);
            if (lines.length > 0) {
              const last = JSON.parse(lines[lines.length - 1]);
              let data = null;
              if (last.attachment && last.attachment.url) {
                const attRes = await fetch(last.attachment.url, { signal: AbortSignal.timeout(3000) });
                if (attRes.ok) data = await attRes.json();
              } else if (last.message) {
                try { data = JSON.parse(last.message); } catch (_) {}
              }
              if (data && (data.thresholds || (data.alertSettings && data.alertSettings.thresholds))) {
                const parsedSettings = data.alertSettings || data;
                inMemoryAlertSettings = parsedSettings;
                return res.status(200).json({ success: true, source: 'cloud_relay', alertSettings: parsedSettings });
              }
            }
          }
        } catch (_) {}

        return res.status(200).json({ success: true, source: 'none', alertSettings: null });
      }

      // 2. Fetch shared transaction batch & include latest alert settings
      let batchData = inMemoryStore;

      if (!batchData && kvUrl && kvToken) {
        const kvRes = await upstashCommand(kvUrl, kvToken, ['GET', 'tb_shared_transactions_latest'], 3000);
        if (kvRes && kvRes.result) {
          batchData = typeof kvRes.result === 'string' ? JSON.parse(kvRes.result) : kvRes.result;
          inMemoryStore = batchData;
        }
      }

      if (!batchData) {
        try {
          const ntfyRes = await fetch(`${NTFY_TXS_TOPIC}/json?poll=1`, {
            signal: AbortSignal.timeout(3500)
          });
          if (ntfyRes.ok) {
            const text = await ntfyRes.text();
            const lines = text.trim().split('\n').filter(Boolean);
            if (lines.length > 0) {
              const last = JSON.parse(lines[lines.length - 1]);
              let data = null;
              if (last.attachment && last.attachment.url) {
                const attRes = await fetch(last.attachment.url, { signal: AbortSignal.timeout(4000) });
                if (attRes.ok) data = await attRes.json();
              } else if (last.message) {
                try { data = JSON.parse(last.message); } catch (_) {}
              }

              if (data) {
                const possibleBatch = data.batch || data;
                if (possibleBatch && possibleBatch.transactions && possibleBatch.transactions.length > 0) {
                  batchData = data;
                  inMemoryStore = batchData;
                }
              }
            }
          }
        } catch (_) {}
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
        return res.status(200).json({ success: true, source: 'cloud', data: payloadToSend, alertSettings: inMemoryAlertSettings });
      }

      return res.status(200).json({
        success: true,
        source: 'none',
        data: null,
        alertSettings: inMemoryAlertSettings,
        message: 'No uploaded team data yet. Displaying demo baseline.'
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
        if (kvUrl && kvToken) {
          persistPromises.push(
            upstashCommand(kvUrl, kvToken, ['SET', 'tb_shared_alert_settings_latest', JSON.stringify(settings)], 3500)
          );
        }

        // Persist to Cloud Relay
        persistPromises.push(
          fetch(NTFY_ALERTS_TOPIC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Title': 'TransactBridge Alert Config' },
            body: JSON.stringify({ type: 'alert_settings', alertSettings: settings, updatedAt: new Date().toISOString() }),
            signal: AbortSignal.timeout(3000)
          }).catch(e => console.warn('Ntfy alert save error:', e.message))
        );

        await Promise.allSettled(persistPromises);

        return res.status(200).json({
          success: true,
          message: 'Alert configuration saved and broadcast to team cloud!',
          alertSettings: settings,
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

      // Persist batch to Upstash Redis / Vercel KV if configured
      if (kvUrl && kvToken) {
        persistPromises.push(
          upstashCommand(kvUrl, kvToken, ['SET', 'tb_shared_transactions_latest', JSON.stringify(payload)], 4000)
        );
      }

      // Persist to Cloud Relay
      persistPromises.push(
        fetch(NTFY_TXS_TOPIC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Title': `Batch: ${payload.name} (${payload.count} records)` },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000)
        }).catch(e => console.warn('Failed to persist to cloud relay:', e.message))
      );

      await Promise.allSettled(persistPromises);

      return res.status(200).json({
        success: true,
        message: `Successfully published batch with ${payload.count} transactions to shared team cloud!`,
        batchId: payload.id,
        uploadedAt: payload.uploadedAt,
        alertSettings: inMemoryAlertSettings
      });
    } catch (err) {
      console.error('Error saving shared data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
