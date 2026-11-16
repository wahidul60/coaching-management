import { Request, Response, NextFunction } from 'express';

export type RoleName = 'ADMIN' | 'HELPDESK' | 'RECEPTIONIST' | 'FOUNDING_MEMBER';

export const authorize = (allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. User not authenticated.',
        },
      });
      return;
    }

    const userRole = req.user.role as RoleName;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. Insufficient permissions for this resource.',
        },
      });
      return;
    }

    next();
  };
};

export default authorize;
