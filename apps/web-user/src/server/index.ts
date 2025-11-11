import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { findUserByEmail, generateToken, verifyToken } from '@large-event/api';
import { db, instances, organizations, userInstanceAccess, eq } from '@large-event/database';

const app = express();
const PORT = 4100;

// Middleware
app.use(cors({
  origin: ['http://localhost:4000', 'http://localhost:3014'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies['auth-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as any).user = decoded.user;
  next();
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user in shared database (must be pre-seeded)
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please contact administrator.' });
    }

    const token = generateToken(user);

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.large-event.com' : undefined
    });

    res.json({
      success: true,
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth-token', { path: '/' });
  res.json({ success: true });
});

// Get current user endpoint
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

// Get token endpoint
app.get('/api/auth/token', authMiddleware, (req, res) => {
  const token = req.cookies['auth-token'];
  res.json({ token });
});

// Get user's accessible instances
app.get('/api/instances', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // Query shared instance access tables
    const userAccess = await db
      .select()
      .from(userInstanceAccess)
      .innerJoin(instances, eq(userInstanceAccess.instanceId, instances.id))
      .innerJoin(organizations, eq(instances.ownerOrganizationId, organizations.id))
      .where(eq(userInstanceAccess.userId, userId));

    // Map to response format
    const instancesList = userAccess.map((row) => ({
      id: row.user_instance_access.instanceId,
      name: row.instances.name,
      accessLevel: row.user_instance_access.accessLevel,
      ownerOrganization: {
        id: row.instances.ownerOrganizationId,
        name: row.organizations.name,
        acronym: row.organizations.acronym,
      },
    }));

    res.json({
      success: true,
      instances: instancesList,
      count: instancesList.length
    });
  } catch (error) {
    console.error('Error fetching instances:', error);
    res.status(500).json({ error: 'Failed to fetch instances' });
  }
});

app.listen(PORT, () => {
  console.log(`User server running on http://localhost:${PORT}`);
});
