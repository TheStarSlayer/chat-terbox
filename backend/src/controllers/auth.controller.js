import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";

export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required!" });

        if (password.length < 6)
            return res.status(400).json({ message: "All fields are required!" });

        const user = await User.findOne({email});

        if (user)
            return res.status(400).json({ message: "User already exists!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
        else {
            return res.status(400).json({ message: "User data invalid!" });
        }
        
    }
    catch (error) {
        console.log(`Error in sign-up controller: ${error.message}`);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};

export const login = (req, res) => {
    res.send("log-in route");
};

export const logout = (req, res) => {
    res.send("log-out route");
};