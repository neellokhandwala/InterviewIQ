import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from '@clerk/express';
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js"

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

//middleware
app.use(express.json());
//credentials: true allows cookies to be sent in cross-origin requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware())

app.use("/api/inngest",serve({client:inngest, functions}));
app.use("api/chat", chatRoutes)
app.use("api/sessions", sessionRoutes)

app.get("/", (req, res) => {
    res.status(200).send("InterviewIQ Backend API is Live!");
});

app.get("/health", (req, res) => {
    res.status(200).json({ msg: "Success Health Check" }); 
});

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