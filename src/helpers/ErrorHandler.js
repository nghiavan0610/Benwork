const config = require('../configs/env');

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class ValidationError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

const errorHandler = (err, req, res, next) => {
    if (err.name === 'TokenDestroyedError') {
        err = new ApiError(401, 'Token destroyed');
    }

    if (
        err.name === 'SequelizeDatabaseError' ||
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        err = new ValidationError(403, err.message);
    }
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: 'false',
        name: err.name,
        message: err.message,
        stack: config.NODE_ENV !== 'production' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { ApiError, ValidationError, notFound, errorHandler };
