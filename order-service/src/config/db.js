import mongoose from "mongoose";
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://warehouse-mongodb:27017/warehouse";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("Error connecting to MONGODB");
  }
};
