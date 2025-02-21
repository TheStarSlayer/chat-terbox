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
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use("/api/auth", authRoutes); // Use authentication router
app.use("/api/message", messageRoutes);

// Open app in PORT
app.listen(PORT, () => {
    console.log("App running on port " + PORT);
    connectDB();
});