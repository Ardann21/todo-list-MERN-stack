import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectioInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`MongoDB connected: ${connectioInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
