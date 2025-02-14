import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required!" });

        if (password.length < 6)
            return res.status(400).json({ message: "All fields are required!" });

        const user = await User.findOne(email);

        if (user)
            return res.status(400).json({ message: "User already exists!" });

        const salt = await bcrypt.salt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = User.create({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: (await newUser)._id,
                fullName: (await newUser).fullName,
                email: (await newUser).email,
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