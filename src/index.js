import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./expressApp.js";


dotenv.config({
  path: "./.env"
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();