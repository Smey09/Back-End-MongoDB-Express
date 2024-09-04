import { Request, Response, NextFunction } from "express";

export const logger = (_req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request Time: ${new Date().toLocaleString()}`);
  next();
};
