import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const responsePayload: {
    success: boolean;
    error: {
      message: string;
      code?: string;
      stack?: string;
    };
  } = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(err.code && { code: err.code }),
    },
  };

  if (!isProduction && err.stack) {
    responsePayload.error.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandler;
