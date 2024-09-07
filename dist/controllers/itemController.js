"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../config/database");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
//! GET: Get all items with pagination, filtering, and sorting
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sortField = req.query.sortField || "price";
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        const minStock = parseInt(req.query.minStock) || 0;
        const maxStock = parseInt(req.query.maxStock) || Number.MAX_SAFE_INTEGER;
        const query = {};
        if (category) {
            query.category = { $regex: new RegExp(category, "i") };
        }
        if (minStock || maxStock) {
            query.stock = { $gte: minStock, $lte: maxStock };
        }
        const items = yield database_1.itemsCollection
            .find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .toArray();
        // Truncate image strings to 100 characters
        const item = items.map((item) => (Object.assign(Object.assign({}, item), { image: item.image ? item.image.substring(0, 100) : undefined })));
        const totalItems = yield database_1.itemsCollection.countDocuments(query);
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            item,
        });
    }
    catch (err) {
        next(new CustomError_1.default("Error retrieving items", 400));
    }
});
exports.getAllItems = getAllItems;
//! GET: Get a single item by ID
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield database_1.itemsCollection.findOne({
            _id: new mongodb_1.ObjectId(req.params.id),
        });
        if (!item) {
            throw new CustomError_1.default("Item not found", 404);
        }
        res.json(item);
    }
    catch (err) {
        next(new CustomError_1.default("Error retrieving item", 500));
    }
});
exports.getItemById = getItemById;
//! POST: Create a new item with image upload
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category, stock } = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : undefined;
        const newItem = {
            name,
            price: parseFloat(price),
            category,
            stock: parseInt(stock, 10),
            image, // Store image as base64
        };
        const result = yield database_1.itemsCollection.insertOne(newItem);
        res.status(201).json(Object.assign({ id: result.insertedId }, newItem));
    }
    catch (err) {
        next(new CustomError_1.default("Error creating item", 500));
    }
});
exports.createItem = createItem;
//! PUT: Update an existing item by ID with image upload
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category, stock } = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : undefined;
        const updatedItem = Object.assign({ name, price: parseFloat(price), category, stock: parseInt(stock, 10) }, (image && { image }));
        const result = yield database_1.itemsCollection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: updatedItem });
        if (result.matchedCount === 0) {
            throw new CustomError_1.default("Item not found", 404);
        }
        const item = yield database_1.itemsCollection.findOne({
            _id: new mongodb_1.ObjectId(req.params.id),
        });
        res.json(item);
    }
    catch (err) {
        next(new CustomError_1.default("Error updating item", 500));
    }
});
exports.updateItem = updateItem;
//! DELETE: Delete an item by ID
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.itemsCollection.deleteOne({
            _id: new mongodb_1.ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            throw new CustomError_1.default("Item not found", 404);
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (err) {
        next(new CustomError_1.default("Error deleting item", 500));
    }
});
exports.deleteItem = deleteItem;
