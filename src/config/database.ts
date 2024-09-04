import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI as string;

// MongoDB client
const client = new MongoClient(uri);

export let db: Db;
export let itemsCollection: Collection;

// Connect to MongoDB
export async function connectToMongoDB(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    db = client.db("MyNewDataBase"); // database name
    itemsCollection = db.collection("Items"); // collection name
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}
