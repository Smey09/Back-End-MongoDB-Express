"use strict";
// src/middleware/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[${new Date().toISOString()}] ${err.name}: ${message}`);
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};
exports.default = errorHandler;
