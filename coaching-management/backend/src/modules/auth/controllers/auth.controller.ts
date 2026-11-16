import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import { loginSchema } from '../validators/auth.validator.js';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = loginSchema.safeParse(req.body);

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

      const { username, password } = validationResult.data;

      const result = await authService.login(username, password);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
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

