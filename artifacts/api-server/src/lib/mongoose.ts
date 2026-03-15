import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

const uri = process.env.MONGODB_URI;

let isConnected = false;

export async function connectMongoose() {
  if (isConnected) return;
  await mongoose.connect(uri, { dbName: "farzeena-portfolio" });
  isConnected = true;
  console.log("Mongoose connected to MongoDB");
}
