import mongoose from "mongoose";

// Create schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

// Create model from schema and export it
const User = mongoose.model("user", userSchema);

export default User;