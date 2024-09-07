// src/controllers/itemController.ts

import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { itemsCollection } from "../config/database";
import { Item } from "../models/itemsModels";
import CustomError from "../utils/CustomError";

//! GET: Get all items with pagination, filtering, and sorting
//*-----------------------------------------------------------------------

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1 Create Paginations
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // 2 Filter
    const category = req.query.category as string;
    const sortField = (req.query.sortField as string) || "price";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    // 3 short min and mixStock
    const minStock = parseInt(req.query.minStock as string) || 0;
    const maxStock =
      parseInt(req.query.maxStock as string) || Number.MAX_SAFE_INTEGER;

    const query: any = {};
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (minStock || maxStock) {
      query.stock = { $gte: minStock, $lte: maxStock };
    }

    // 4 short Itmes
    const items = await itemsCollection
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalItems = await itemsCollection.countDocuments(query);

    // 5 push data to clind
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    });
  } catch (err) {
    next(new CustomError("Error retrieving items", 500));
  }
};

//! GET: Get a single item by ID
//*-----------------------------------------------------------------------

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await itemsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!item) {
      throw new CustomError("Item not found", 404);
    }

    res.json(item);
  } catch (err) {
    next(new CustomError("Error retrieving item", 500));
  }
};

//! POST: Create a new item
//*-----------------------------------------------------------------------

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newItem: Item = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    };

    const result = await itemsCollection.insertOne(newItem);
    res.status(201).json({ id: result.insertedId, ...newItem });
  } catch (err) {
    next(new CustomError("Error creating item", 500));
  }
};

//! PUT: Update an existing item by ID
//* -----------------------------------------------------------------------

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedItem = req.body;
    const result = await itemsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) {
      throw new CustomError("Item not found", 404);
    }

    const item = await itemsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(item);
  } catch (err) {
    next(new CustomError("Error updating item", 500));
  }
};

//* DELETE: Delete an item by ID
//! -----------------------------------------------------------------------

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await itemsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      throw new CustomError("Item not found", 404);
    }
    
    res.status(200).json({ message: "Item deleted successfully"});
  } catch (err) {
    next(new CustomError("Error deleting item", 500));
  }
};
