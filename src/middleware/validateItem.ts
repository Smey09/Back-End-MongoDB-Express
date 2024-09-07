// src/middleware/validateItem.ts
import { Request, Response, NextFunction } from "express";
import {
  createItemSchema,
  updateItemSchema,
} from "../validators/itemValidator";

export const validateCreateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createItemSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).send({ message: (error as Error).message });
  }
};

export const validateUpdateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateItemSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).send({ message: (error as Error).message });
  }
};
