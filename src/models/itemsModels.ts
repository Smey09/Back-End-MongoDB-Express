import { ObjectId } from "mongodb";

export interface Item {
  _id?: ObjectId;
  name: string;
  price: number;
  category: string;
  stock: number;
}
