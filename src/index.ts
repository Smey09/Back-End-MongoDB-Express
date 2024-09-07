import express from "express";
import { connectToMongoDB } from "./config/database";
import itemRoutes from "./routes/itemRoutes.routes";
import { logger } from "./middleware/logger";
import errorHandler from "./middleware/handleError";
import path from "path";

const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Global middleware for logging request time
app.use(logger);

connectToMongoDB();
app.use("/api/v1", itemRoutes);
app.use(errorHandler); // globle Handler Error

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
