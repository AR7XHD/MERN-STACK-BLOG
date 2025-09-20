import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { handlerError } from "./helpers/handlerError.js";
import AuthRouter from "./Routes/Auth.routes.js";
import UserRouter from "./Routes/user.routes.js";
import CategoryRouter from "./Routes/Category.routes.js";
import BlogRouter from "./Routes/blog.routes.js";
import CommentRouter from "./Routes/comments.routes.js";
import BlogLikeRouter from "./Routes/bloglike.routes.js";
import https from "https";
import dbConnect from "./config/db.js";

// Initialize express app
const app = express();

// Global HTTP agent settings
https.globalAgent.keepAlive = true;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_API, 
    credentials: true
}));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/comment", CommentRouter);
app.use("/api/bloglike", BlogLikeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ success: false, message });
});

// Connect to DB and start server
const startServer = async () => {
    try {
        console.log('Connecting to database...');
        await dbConnect();
        
        const port = process.env.PORT || 5173;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
