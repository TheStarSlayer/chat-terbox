import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send("Sign-up route");
});

router.get("/login", (req, res) => {
    res.send("Log-in route");
});

router.get("/logout", (req, res) => {
    res.send("Log-out route");
});

export default router;