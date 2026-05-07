import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import app from "../src/expressApp.js";

// Load env vars
dotenv.config();

// Connect to database before handling requests
connectDB();

export default app;
