import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connection success: ${conn.connection.host}`);
    }
    catch (error) {
        console.log("Error in connecting to database: " + error.message);
    }
};