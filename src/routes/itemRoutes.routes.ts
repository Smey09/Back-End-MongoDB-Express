import { Router } from "express";
import multer from "multer";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import {
  validateCreateItem,
  validateUpdateItem,
} from "../middleware/validateItem";

const router = Router();

// Configure multer storage
const storage = multer.memoryStorage(); // Store in memory if you store in MongoDB
const upload = multer({ storage });

router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.post("/items", upload.single("image"), validateCreateItem, createItem);
router.put(
  "/items/:id",
  upload.single("image"),
  validateUpdateItem,
  updateItem
); // Handles image upload
router.delete("/items/:id", deleteItem);

export default router;
