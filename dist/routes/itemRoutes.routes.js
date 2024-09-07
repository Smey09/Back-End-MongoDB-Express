"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const itemController_1 = require("../controllers/itemController");
const validateItem_1 = require("../middleware/validateItem");
const router = (0, express_1.Router)();
// Configure multer storage
const storage = multer_1.default.memoryStorage(); // Store in memory if you store in MongoDB
const upload = (0, multer_1.default)({ storage });
router.get("/items", itemController_1.getAllItems);
router.get("/items/:id", itemController_1.getItemById);
router.post("/items", upload.single("image"), validateItem_1.validateCreateItem, itemController_1.createItem);
router.put("/items/:id", upload.single("image"), validateItem_1.validateUpdateItem, itemController_1.updateItem); // Handles image upload
router.delete("/items/:id", itemController_1.deleteItem);
exports.default = router;
