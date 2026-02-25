import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

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

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));
    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {        
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

startServer();