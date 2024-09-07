"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const itemRoutes_routes_1 = __importDefault(require("./routes/itemRoutes.routes"));
const logger_1 = require("./middleware/logger");
const handleError_1 = __importDefault(require("./middleware/handleError"));
const app = (0, express_1.default)();
const PORT = 4000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Global middleware for logging request time
app.use(logger_1.logger);
(0, database_1.connectToMongoDB)();
app.use("/api/v1", itemRoutes_routes_1.default);
app.use(handleError_1.default); // globle Handler Error
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
