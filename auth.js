// Vercel Serverless Function: /api/auth
// Enterprise Authentication & Role Management for Transact Bridge

const AUTHORIZED_ACCOUNTS = [
  {
    email: 'shreyasth@transactbridge.com',
    displayEmail: 'Shreyasth@transactbridge.com',
    password: 'Shreyasth@1234',
    name: 'Shreyasth Singh',
    role: 'admin',
    avatar: 'SS',
    title: 'Platform Administrator'
  },
  {
    email: 'ops@transactbridge.com',
    displayEmail: 'Ops@transactbridge.com',
    password: 'Transact@12',
    name: 'Operations Team',
    role: 'viewer',
    avatar: 'OP',
    title: 'Operations Stakeholder'
  }
];

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

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }

      const { email, password } = body || {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please enter both your corporate email and password.'
        });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPass = String(password).trim();

      const account = AUTHORIZED_ACCOUNTS.find(a => a.email === cleanEmail);

      if (!account) {
        return res.status(401).json({
          success: false,
          error: 'Account not recognized. Authorized accounts: Shreyasth@transactbridge.com or Ops@transactbridge.com'
        });
      }

      if (account.password !== cleanPass) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password. Please verify your credentials and try again.'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Authenticated successfully as ${account.name}`,
        user: {
          email: account.displayEmail,
          name: account.name,
          role: account.role,
          avatar: account.avatar,
          title: account.title,
          token: 'token_' + Date.now() + '_' + account.role,
          loginAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Auth endpoint error:', err);
      return res.status(500).json({ success: false, error: 'Internal authentication error: ' + err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
