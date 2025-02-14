import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
    const token = jwt.sign(id, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // XSS attacks
        sameSite: "strict", // Cross site attacks
        secure: process.env.DEVELOPMENT !== 'dev'
    });

    return token;
};