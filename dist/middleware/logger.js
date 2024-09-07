"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (_req, _res, next) => {
    console.log(`Request Time: ${new Date().toLocaleString()}`);
    next();
};
exports.logger = logger;
