import { Request, Response, NextFunction } from 'express';

// Error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  
  // If it's not an ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  const apiError = error as ApiError;
  
  // Send the error response
  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined,
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};
