import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import evalRoutes from './routes/evals';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Basic security and setup
  app.use(helmet());
  app.use(cors({
    origin: '*', // Allow all for demo purposes, can be restricted via config
  }));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const evalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Eval rate limit exceeded. Wait a moment before running more evaluations.' },
  });

  app.use(express.json({ limit: '5mb' }));

  // The demo now only requires the stateless evaluation API
  // All prompt/version management is handled locally in the browser
  app.use('/api/evals', evalLimiter, evalRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(errorHandler);

  return app;
}
