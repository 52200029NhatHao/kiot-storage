import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL || "mongodb://kiot-db:27017/kiot-db";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("Error connecting to MONGODB");
  }
};
