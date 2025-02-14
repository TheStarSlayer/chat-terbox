import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";

export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required!" });

        if (password.length < 6)
            return res.status(400).json({ message: "Password length is too small!" });

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
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
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

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required!" });

        const user = await User.findOne({email});
        if (!user)
            return res.status(400).json({ message: "Invalid Credentials!" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid Credentials!" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log(`Error in login controller: ${error.message}`);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    res.send("log-out route");
};