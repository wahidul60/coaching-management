import jwt from 'jsonwebtoken';
import config from '../../config/env.js';
import { AuthenticatedUser } from '../../middleware/auth.middleware.js';

const JWT_ISSUER = 'coaching-management-backend';
const JWT_AUDIENCE = 'coaching-management-client';

export const generateAccessToken = (payload: AuthenticatedUser): string => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

export const verifyAccessToken = (token: string): AuthenticatedUser | null => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as AuthenticatedUser;
    
    if (!decoded || !decoded.userId || !decoded.role) {
      return null;
    }
    return {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
};

