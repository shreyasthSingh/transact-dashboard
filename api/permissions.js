// Vercel Serverless Function: /api/permissions
// Role-based dynamic permissions management for Transact Bridge

let inMemoryPermissions = {
  canUpload: false,
  canAdjustSla: false,
  canDispatchAlerts: true,
  canTriggerAnalysis: false,
  canExportReports: true,
  canViewFinancials: true
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return current permissions policy
  if (req.method === 'GET') {
    try {
      const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

      if (kvUrl && kvToken) {
        try {
          const kvRes = await fetch(`${kvUrl}/get/tb_role_permissions_latest`, {
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
          console.warn('Vercel KV fetch failed for permissions:', kvErr.message);
        }
      }

      // Cloud KV fallback
      try {
        const fbRes = await fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_role_permissions_v1', {
          headers: { 'Accept': 'application/json' }
        });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData && fbData.permissions) {
            inMemoryPermissions = fbData.permissions;
            return res.status(200).json({ success: true, source: 'cloud_fallback', data: fbData });
          }
        }
      } catch (_) {}

      return res.status(200).json({
        success: true,
        source: 'memory',
        data: { permissions: inMemoryPermissions, updatedAt: new Date().toISOString() }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Admin updates permissions policy
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }

      if (!body || !body.permissions) {
        return res.status(400).json({ success: false, error: 'Missing permissions object in payload.' });
      }

      inMemoryPermissions = {
        canUpload: !!body.permissions.canUpload,
        canAdjustSla: !!body.permissions.canAdjustSla,
        canDispatchAlerts: !!body.permissions.canDispatchAlerts,
        canTriggerAnalysis: !!body.permissions.canTriggerAnalysis,
        canExportReports: !!body.permissions.canExportReports,
        canViewFinancials: !!body.permissions.canViewFinancials
      };

      const payload = {
        permissions: inMemoryPermissions,
        updatedBy: body.updatedBy || 'admin',
        updatedAt: new Date().toISOString()
      };

      // Vercel KV / Redis
      const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

      if (kvUrl && kvToken) {
        try {
          await fetch(`${kvUrl}/set/tb_role_permissions_latest`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${kvToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          console.warn('Failed to persist permissions to KV:', e.message);
        }
      }

      // KVDB Cloud Fallback
      try {
        fetch('https://kvdb.io/A95b1Yf7K9sW4j2R8tLmPx/tb_role_permissions_v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (_) {}

      return res.status(200).json({
        success: true,
        message: 'Role permissions updated and broadcasted successfully.',
        data: payload
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
