import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Service URLs
const TEAM_A_API_URL = process.env.TEAM_A_API_URL || 'http://localhost:3001';
const TEAM_B_API_URL = process.env.TEAM_B_API_URL || 'http://localhost:3002';
const TEAM_C_API_URL = process.env.TEAM_C_API_URL || 'http://localhost:3003';
const TEAM_D_API_URL = process.env.TEAM_D_API_URL || 'http://localhost:3004';

// Proxy configurations
const proxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err: any, req: any, res: any) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      error: 'Service temporarily unavailable',
    });
  },
  onProxyReq: (proxyReq: any, req: any, res: any) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
};

// Team A API
app.use('/api/v1/teamA', createProxyMiddleware({
  target: TEAM_A_API_URL,
  pathRewrite: {
    '^/api/v1/teamA': '',
  },
  ...proxyOptions,
}));

// Team B API
app.use('/api/v1/teamB', createProxyMiddleware({
  target: TEAM_B_API_URL,
  pathRewrite: {
    '^/api/v1/teamB': '',
  },
  ...proxyOptions,
}));

// Team C API
app.use('/api/v1/teamC', createProxyMiddleware({
  target: TEAM_C_API_URL,
  pathRewrite: {
    '^/api/v1/teamC': '',
  },
  ...proxyOptions,
}));

// Team D API
app.use('/api/v1/teamD', createProxyMiddleware({
  target: TEAM_D_API_URL,
  pathRewrite: {
    '^/api/v1/teamD': '',
  },
  ...proxyOptions,
}));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      teamA: TEAM_A_API_URL,
      teamB: TEAM_B_API_URL,
      teamC: TEAM_C_API_URL,
      teamD: TEAM_D_API_URL,
    },
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Large Event API Gateway',
    version: '1.0.0',
    endpoints: {
      teamA: '/api/v1/teamA',
      teamB: '/api/v1/teamB',
      teamC: '/api/v1/teamC',
      teamD: '/api/v1/teamD',
    },
    documentation: {
      teamA: `${TEAM_A_API_URL}/api`,
      teamB: `${TEAM_B_API_URL}/api`,
      teamC: `${TEAM_C_API_URL}/api`,
      teamD: `${TEAM_D_API_URL}/api`,
    },
  });
});

// Catch-all handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'Please check the API documentation at /api',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});