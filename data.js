// Vercel Serverless Function: /api/data
// Centralized shared transaction store for Transact Bridge Team Monitoring

let inMemoryStore = null;

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

  // Handle GET - Fetch latest shared transaction batch
  if (req.method === 'GET') {
    try {
      // 1. Try Vercel KV / Upstash Redis if configured in Vercel environment
      const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

      if (kvUrl && kvToken) {
        try {
          const kvRes = await fetch(`${kvUrl}/get/tb_shared_transactions_latest`, {
            headers: { Authorization: `Bearer ${kvToken}` }
          });
          if (kvRes.ok) {
            const kvData = await kvRes.json();
            if (kvData && kvData.result) {
              const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
              return res.status(200).json({ success: true, source: 'vercel_kv', data: parsed });
            }
          }
        } catch (kvErr) {
          console.warn('Vercel KV fetch failed, falling back to memory/cloud:', kvErr.message);
        }
      }

      // 2. Return in-memory cached batch if available
      if (inMemoryStore) {
        return res.status(200).json({ success: true, source: 'memory', data: inMemoryStore });
      }

      // 3. Try free public KV store fallback if inMemoryStore is not yet initialized
      try {
        const fallbackRes = await fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_shared_transactions_v1', {
          headers: { 'Accept': 'application/json' }
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.transactions && fallbackData.transactions.length > 0) {
            inMemoryStore = fallbackData;
            return res.status(200).json({ success: true, source: 'cloud_fallback', data: fallbackData });
          }
        }
      } catch (fbErr) {
        // Quiet fallback
      }

      // 4. If nothing uploaded yet, return empty state
      return res.status(200).json({ success: true, source: 'none', data: null, message: 'No uploaded team data yet. Displaying demo baseline.' });
    } catch (err) {
      console.error('Error fetching shared data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Handle POST - Save newly uploaded batch from Admin
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }

      if (!body || !body.batch) {
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
        updatedAt: new Date().toISOString()
      };

      // Always update in-memory cache
      inMemoryStore = payload;

      // Persist to Vercel KV / Upstash Redis if configured
      const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

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
          if (setRes.ok) {
            persistedKV = true;
          }
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
        uploadedAt: payload.uploadedAt
      });
    } catch (err) {
      console.error('Error saving shared data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
