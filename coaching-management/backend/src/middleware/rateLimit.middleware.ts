import { config } from '../config/env.js';
import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitRecord>();
const usernameStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = config.NODE_ENV === 'development' ? 50 : 5;

// Prune expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(key);
    }
  }
  for (const [key, record] of usernameStore.entries()) {
    if (now > record.resetTime) {
      usernameStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export const normalizeUsername = (username: string): string => {
  return username ? username.trim().toLowerCase() : '';
};

/**
 * In-memory rate limiter for login endpoint.
 * Note: Scoped to single-instance deployments. Multi-instance scaling requires a shared store like Redis.
 */
export const loginRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const rawUsername = req.body && req.body.username ? String(req.body.username) : '';
  const normalizedUser = normalizeUsername(rawUsername);

  const now = Date.now();

  // Check IP rate limit
  let ipRecord = ipStore.get(ip);
  if (ipRecord && now < ipRecord.resetTime) {
    if (ipRecord.count >= MAX_ATTEMPTS) {
      res.status(429).json({
        success: false,
        error: {
          message: 'Too many login attempts from this IP address. Please try again later.',
        },
      });
      return;
    }
  }

  // Check Username rate limit if username is provided
  if (normalizedUser) {
    let userRecord = usernameStore.get(normalizedUser);
    if (userRecord && now < userRecord.resetTime) {
      if (userRecord.count >= MAX_ATTEMPTS) {
        res.status(429).json({
          success: false,
          error: {
            message: 'Too many failed login attempts for this account. Please try again later.',
          },
        });
        return;
      }
    }
  }

  next();
};

export const recordFailedLoginAttempt = (ip: string, username: string): void => {
  const now = Date.now();
  const resetTime = now + WINDOW_MS;

  // Track IP
  const ipRecord = ipStore.get(ip);
  if (!ipRecord || now > ipRecord.resetTime) {
    ipStore.set(ip, { count: 1, resetTime });
  } else {
    ipRecord.count += 1;
  }

  // Track Username
  const normalizedUser = normalizeUsername(username);
  if (normalizedUser) {
    const userRecord = usernameStore.get(normalizedUser);
    if (!userRecord || now > userRecord.resetTime) {
      usernameStore.set(normalizedUser, { count: 1, resetTime });
    } else {
      userRecord.count += 1;
    }
  }
};

export const resetLoginAttempts = (ip: string, username: string): void => {
  ipStore.delete(ip);
  const normalizedUser = normalizeUsername(username);
  if (normalizedUser) {
    usernameStore.delete(normalizedUser);
  }
};
