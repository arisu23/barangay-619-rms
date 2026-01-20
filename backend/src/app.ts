import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js"
import { pool } from "./config/database.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Health check route
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Barangay RMS backend is running"
    });
});

//Error handler
app.use(errorHandler);

export default app;