import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import prisma from '../config/prisma.js';

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

const JWT_ISSUER = 'coaching-management-backend';
const JWT_AUDIENCE = 'coaching-management-client';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    let decoded: AuthenticatedUser;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }) as AuthenticatedUser;
    } catch (jwtError: any) {
      // Normalize all JWT verification errors to 401
      res.status(401).json({
        success: false,
        error: {
          message: jwtError.name === 'TokenExpiredError' ? 'Token has expired.' : 'Invalid token signature, issuer, audience, or malformed token.',
        },
      });
      return;
    }

    if (!decoded || !decoded.userId || !decoded.role) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token payload.',
        },
      });
      return;
    }

    // Verify current user existence and active status in database to prevent stale tokens after suspension/role changes
    const userInDb = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!userInDb || !userInDb.isActive) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is deactivated, suspended, or no longer exists.',
        },
      });
      return;
    }

    // Ensure role matches current database role (preventing stale role permissions)
    req.user = {
      userId: userInDb.id,
      role: userInDb.role.name,
      email: userInDb.email || undefined,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Internal authentication error.',
      },
    });
  }
};

export default authenticate;

