import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export interface AuthenticatedUser {
  userId: string;
  role: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided or invalid format.',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthenticatedUser;

    if (!decoded || !decoded.userId || !decoded.role) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Invalid token payload.',
        },
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token has expired.',
        },
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Invalid token.',
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Internal authentication error.',
      },
    });
  }
};

export default authenticate;
