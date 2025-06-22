"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    console.error('Error:', err);
    // Default error
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    // Firebase Auth errors
    if (err.message?.includes('auth/')) {
        statusCode = 401;
        message = 'Authentication failed';
    }
    // Validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }
    // Duplicate key error
    if (err.message?.includes('duplicate key')) {
        statusCode = 400;
        message = 'Duplicate resource';
    }
    // Cast error
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map