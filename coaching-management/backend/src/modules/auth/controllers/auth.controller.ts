import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import { loginSchema, createUserSchema } from '../validators/auth.validator.js';
import { recordFailedLoginAttempt, resetLoginAttempts } from '../../../middleware/rateLimit.middleware.js';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const rawUsername = req.body && req.body.username ? String(req.body.username) : '';

    try {
      const validationResult = loginSchema.safeParse(req.body);

      if (!validationResult.success) {
        recordFailedLoginAttempt(ip, rawUsername);
        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed.',
            details: validationResult.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
        return;
      }

      const { username, password } = validationResult.data;
      const ipAddress = req.ip || req.socket.remoteAddress;

      try {
        const result = await authService.login(username, password, ipAddress);
        // Reset rate limiter counters on successful login
        resetLoginAttempts(ip, username);

        res.status(200).json({
          success: true,
          data: {
            user: result.user,
            accessToken: result.accessToken,
          },
        });
      } catch (loginError: any) {
        recordFailedLoginAttempt(ip, username);
        throw loginError;
      }
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = createUserSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed.',
            details: validationResult.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
        return;
      }

      const actorUserId = req.user?.userId;
      if (!actorUserId) {
        res.status(401).json({
          success: false,
          error: { message: 'Unauthorized actor.' },
        });
        return;
      }

      const ipAddress = req.ip || req.socket.remoteAddress;
      const newUser = await authService.createUser(validationResult.data, actorUserId, ipAddress);

      res.status(201).json({
        success: true,
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          id: req.user?.userId,
          email: req.user?.email,
          role: req.user?.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();



