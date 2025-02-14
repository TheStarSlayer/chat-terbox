import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config(); // Access .env variables
const app = express(); // Create express instance

const PORT = process.env.PORT; // Import port from .env

app.use("/api/auth", authRoutes); // Use authentication router 

// Open app in PORT
app.listen(PORT, () => {
    console.log("App running on port " + PORT);
    connectDB();
});