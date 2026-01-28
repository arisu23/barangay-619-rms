import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js"
import authRoutes from "./modules/auth/auth.routes.js";
import residentRoutes from "./modules/residents/resident.routes.js";
import householdRoutes from "./modules/households/household.routes.js";
import familyRoutes from "./modules/family/family.routes.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Login Route
app.use("/api/auth", authRoutes);

//Register user
app.use("/api/users", userRoutes);

//Resident Route
app.use("/api/residents", residentRoutes);

//Household Route
app.use("/api/households", householdRoutes);

//Family Route
app.use("/api/families", familyRoutes);

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