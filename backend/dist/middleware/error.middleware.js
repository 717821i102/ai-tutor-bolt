"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.ApiError = void 0;
// Error class for API errors
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = err;
    // If it's not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }
    const apiError = error;
    // Send the error response
    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
// Not found middleware
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map