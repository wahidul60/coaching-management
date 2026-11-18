import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/routes/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';
import { loginRateLimiter } from './middleware/rateLimit.middleware.js';

const app = express();

// Trust proxy correctly for accurate IP detection behind reverse proxies
app.set('trust proxy', true);

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes with login rate limiting
app.use('/api/createStudent', loginRateLimiter, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next();
});


// Centralized Error Handler
app.use(errorHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next();
});

export default app;
