import express from 'express';
import cors from 'cors';
import { ENV } from './lib/env.js';

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("InterviewIQ Backend API is Live!");
});

app.get("/health", (req, res) => {
    res.status(200).json({ msg: "Success Health Check" }); 
});

app.get("/books", (req, res) => {
    res.status(200).json({ msg: "Success Books Check" }); 
});


app.listen(ENV.PORT || 10000, () => console.log(`Server running on port ${ENV.PORT || 10000}`));
