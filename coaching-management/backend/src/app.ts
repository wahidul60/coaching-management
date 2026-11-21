import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/routes/auth.routes.js';
import studentRoutes from './modules/students/routes/student.routes.js';
import courseRoutes from './modules/courses/routes/course.routes.js';
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

// API Routes
app.use('/api/auth', loginRateLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
