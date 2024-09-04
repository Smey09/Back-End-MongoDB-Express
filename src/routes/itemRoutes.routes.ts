// src/routes/itemRoutes.ts
import { Router } from "express";
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

router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.post("/items", validateCreateItem, createItem);
router.put("/items/:id", validateUpdateItem, updateItem);
router.delete("/items/:id", deleteItem);

export default router;
