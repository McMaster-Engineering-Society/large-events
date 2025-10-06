import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import proxy from '@fastify/http-proxy';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const PORT = Number(process.env.GATEWAY_PORT) || 3000;

// Service URLs
const TEAM_A_API_URL = process.env.TEAM_A_API_URL || 'http://localhost:3001';
const TEAM_B_API_URL = process.env.TEAM_B_API_URL || 'http://localhost:3002';
const TEAM_C_API_URL = process.env.TEAM_C_API_URL || 'http://localhost:3003';
const TEAM_D_API_URL = process.env.TEAM_D_API_URL || 'http://localhost:3004';

async function start() {
  try {
    // Register security plugins
    await fastify.register(helmet);
    await fastify.register(cors);

    // Register rate limiting
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
      errorResponseBuilder: () => {
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'Too many requests from this IP, please try again later.',
        };
      },
    });

    // Health check endpoint
    fastify.get('/health', async (_request, reply) => {
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
          teamA: TEAM_A_API_URL,
          teamB: TEAM_B_API_URL,
          teamC: TEAM_C_API_URL,
          teamD: TEAM_D_API_URL,
        },
      };
    });

    // API documentation endpoint
    fastify.get('/api', async (_request, reply) => {
      return {
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
      };
    });

    // Register proxy routes for Team A
    await fastify.register(proxy, {
      upstream: TEAM_A_API_URL,
      prefix: '/api/v1/teamA',
      rewritePrefix: '',
      http2: false,
    });

    // Register proxy routes for Team B
    await fastify.register(proxy, {
      upstream: TEAM_B_API_URL,
      prefix: '/api/v1/teamB',
      rewritePrefix: '',
      http2: false,
    });

    // Register proxy routes for Team C
    await fastify.register(proxy, {
      upstream: TEAM_C_API_URL,
      prefix: '/api/v1/teamC',
      rewritePrefix: '',
      http2: false,
    });

    // Register proxy routes for Team D
    await fastify.register(proxy, {
      upstream: TEAM_D_API_URL,
      prefix: '/api/v1/teamD',
      rewritePrefix: '',
      http2: false,
    });

    // Catch-all 404 handler
    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        success: false,
        error: 'Endpoint not found',
        message: 'Please check the API documentation at /api',
      });
    });

    // Start the server
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📖 API Documentation available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
