import { ObjectId } from "mongodb";

export interface Item {
  _id?: ObjectId;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string; // Optional image field (base64 string)
}
