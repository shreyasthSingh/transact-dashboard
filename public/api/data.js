// Vercel Serverless Function: /api/data
// Centralized shared transaction & alert configuration store for Transact Bridge Team Monitoring

let inMemoryStore = null;
let inMemoryAlertSettings = null;

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
          try {
            const kvRes = await fetch(`${kvUrl}/get/tb_shared_alert_settings_latest`, {
              headers: { Authorization: `Bearer ${kvToken}` }
            });
            if (kvRes.ok) {
              const kvData = await kvRes.json();
              if (kvData && kvData.result) {
                const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
                inMemoryAlertSettings = parsed;
                return res.status(200).json({ success: true, source: 'vercel_kv', alertSettings: parsed });
              }
            }
          } catch (_) {}
        }
        try {
          const fbRes = await fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_shared_alert_settings_v1', {
            headers: { 'Accept': 'application/json' }
          });
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            if (fbData && fbData.thresholds) {
              inMemoryAlertSettings = fbData;
              return res.status(200).json({ success: true, source: 'cloud_fallback', alertSettings: fbData });
            }
          }
        } catch (_) {}

        return res.status(200).json({ success: true, source: 'none', alertSettings: null });
      }

      // 2. Fetch shared transaction batch & include latest alert settings
      let batchData = inMemoryStore;

      if (!batchData && kvUrl && kvToken) {
        try {
          const kvRes = await fetch(`${kvUrl}/get/tb_shared_transactions_latest`, {
            headers: { Authorization: `Bearer ${kvToken}` }
          });
          if (kvRes.ok) {
            const kvData = await kvRes.json();
            if (kvData && kvData.result) {
              batchData = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
              inMemoryStore = batchData;
            }
          }
        } catch (kvErr) {
          console.warn('Vercel KV fetch failed:', kvErr.message);
        }
      }

      if (!batchData) {
        try {
          const fallbackRes = await fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_shared_transactions_v1', {
            headers: { 'Accept': 'application/json' }
          });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData && fallbackData.transactions && fallbackData.transactions.length > 0) {
              batchData = fallbackData;
              inMemoryStore = batchData;
            }
          }
        } catch (_) {}
      }

      // Attempt to load alert settings if not already cached
      if (!inMemoryAlertSettings && kvUrl && kvToken) {
        try {
          const kvAlertRes = await fetch(`${kvUrl}/get/tb_shared_alert_settings_latest`, {
            headers: { Authorization: `Bearer ${kvToken}` }
          });
          if (kvAlertRes.ok) {
            const parsed = await kvAlertRes.json();
            if (parsed && parsed.result) {
              inMemoryAlertSettings = typeof parsed.result === 'string' ? JSON.parse(parsed.result) : parsed.result;
            }
          }
        } catch (_) {}
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

        // Persist to Vercel KV if available
        if (kvUrl && kvToken) {
          try {
            await fetch(`${kvUrl}/set/tb_shared_alert_settings_latest`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(settings)
            });
          } catch (_) {}
        }

        // Persist to Fallback KV
        try {
          fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_shared_alert_settings_v1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
          }).catch(() => {});
        } catch (_) {}

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

      // Persist batch to Vercel KV if configured
      let persistedKV = false;
      if (kvUrl && kvToken) {
        try {
          const setRes = await fetch(`${kvUrl}/set/tb_shared_transactions_latest`, {
            method: 'POST',
            headers: { 
              Authorization: `Bearer ${kvToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (setRes.ok) persistedKV = true;
        } catch (kvErr) {
          console.warn('Failed to persist to Vercel KV:', kvErr.message);
        }
      }

      // Persist to fallback KV
      try {
        fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_shared_transactions_v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (_) {}

      return res.status(200).json({
        success: true,
        message: `Successfully published batch with ${payload.count} transactions to shared team cloud!`,
        batchId: payload.id,
        persistedKV,
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
