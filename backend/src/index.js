import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config(); // Access .env variables
const app = express(); // Create express instance

const PORT = process.env.PORT; // Import port from .env

app.use(cookieParser());
app.use(express.json()); // Returns body as JSON
app.use("/api/auth", authRoutes); // Use authentication router
app.use("/api/message", messageRoutes);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Open app in PORT
app.listen(PORT, () => {
    console.log("App running on port " + PORT);
    connectDB();
});