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

const NTFY_PERMS_TOPIC = 'https://ntfy.sh/tb_shared_permissions_transactbridge_v1';

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

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // GET: Return current permissions policy
  if (req.method === 'GET') {
    try {
      if (kvUrl && kvToken) {
        try {
          const kvRes = await fetch(`${kvUrl}/get/tb_role_permissions_latest`, {
            headers: { Authorization: `Bearer ${kvToken}` },
            signal: AbortSignal.timeout(3000)
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

      // Cloud Relay fallback
      try {
        const ntfyRes = await fetch(`${NTFY_PERMS_TOPIC}/json?poll=1`, {
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
            if (data && data.permissions) {
              inMemoryPermissions = data.permissions;
              return res.status(200).json({ success: true, source: 'cloud_relay', data });
            }
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

      const persistPromises = [];

      // Vercel KV / Redis
      if (kvUrl && kvToken) {
        persistPromises.push(
          fetch(`${kvUrl}/set/tb_role_permissions_latest`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${kvToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(3000)
          }).catch(e => console.warn('Failed to persist permissions to KV:', e.message))
        );
      }

      // Cloud Relay
      persistPromises.push(
        fetch(NTFY_PERMS_TOPIC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Title': 'TransactBridge Role Permissions' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(3000)
        }).catch(e => console.warn('Failed to persist permissions to relay:', e.message))
      );

      await Promise.allSettled(persistPromises);

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
