import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { itemsCollection } from "../config/database";
import { Item } from "../models/itemsModels";

// GET: Get all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const items = await itemsCollection.find({}).toArray();
    res.json(items);
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
