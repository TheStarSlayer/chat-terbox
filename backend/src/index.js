import express from "express";

const app = express();

app.listen(5001, () => {
    console.log("App running on port 5001");
});