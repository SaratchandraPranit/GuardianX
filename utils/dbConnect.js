import mongoose from "mongoose";
const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

export default async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      // If already connected, return the existing connection
      return;
    }
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    console.log("Connection string used (without credentials):", MONGO_URI.replace(/\/\/.*@/, "//***:***@"));
    throw err; // Re-throw the error so it can be caught by the calling function
  }
}
