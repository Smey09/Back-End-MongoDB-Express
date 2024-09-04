import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { itemsCollection } from "../config/database";
import { Item } from "../models/itemsModels";

// GET: Get all items with pagination, filtering, and sorting
export const getAllItems = async (req: Request, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 5; // Default to 5 items per page
    const skip = (page - 1) * limit;

    // Filtering
    const category = req.query.category as string;

    // Sorting parameters
    const sortField = (req.query.sortField as string) || "price";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default to ascending order

    // Build the query object
    const query: any = {};
    if (category) {
      query.category = category;
    }

    // Fetch items with pagination, filtering, and sorting
    const items = await itemsCollection
      .find(query)
      .sort({ [sortField]: sortOrder }) // Sort by the specified field and order
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total item count for pagination info
    const totalItems = await itemsCollection.countDocuments(query);

    res.json({
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    });
  } catch (err) {
    res.status(500).send("Error retrieving items");
  }
};

// GET: Get a single item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await itemsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!item) return res.status(404).send("Item not found");
    res.json(item);
  } catch (err) {
    res.status(500).send("Error retrieving item");
  }
};

// POST: Create a new item
export const createItem = async (req: Request, res: Response) => {
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
    res.status(500).send("Error creating item");
  }
};

// PUT: Update an existing item by ID
export const updateItem = async (req: Request, res: Response) => {
  try {
    const updatedItem: Item = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    };
    const result = await itemsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0)
      return res.status(404).send("Item not found");
    res.json(
      await itemsCollection.findOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (err) {
    res.status(500).send("Error updating item");
  }
};

// DELETE: Delete an item by ID
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const result = await itemsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).send("Item not found");
    res.send("Item deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting item");
  }
};
