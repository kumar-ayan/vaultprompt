import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import promptRoutes from './routes/prompts';
import versionRoutes from './routes/versions';
import testCaseRoutes from './routes/testcases';
import evalRoutes from './routes/evals';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export function createApp() {
  const app = express();
  const isDev = env.NODE_ENV !== 'production';

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'none'"],
          styleSrc: ["'none'"],
          imgSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      message: 'PromptVC Backend running',
      environment: env.NODE_ENV,
    });
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        if ((isDev && !origin) || (origin && env.allowedOrigins.includes(origin))) {
          return callback(null, true);
        }

        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  const evalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Eval rate limit exceeded. Wait a moment before running more evaluations.' },
  });

  app.use(express.json({ limit: '5mb' }));

  app.use('/api/prompts', apiLimiter, promptRoutes);
  app.use('/api/prompts', apiLimiter, versionRoutes);
  app.use('/api/prompts', apiLimiter, testCaseRoutes);
  app.use('/api/evals', evalLimiter, evalRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(errorHandler);

  return app;
}
