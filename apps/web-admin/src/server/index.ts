import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { validateUser, generateToken, verifyToken } from '../lib/auth.js';
import { serialize } from 'cookie';

const app = express();
const PORT = 4101;

// Middleware
app.use(cors({
  origin: 'http://localhost:4001',
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

    const user = await validateUser(email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const token = generateToken(user);

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1000,
      path: '/'
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

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});
