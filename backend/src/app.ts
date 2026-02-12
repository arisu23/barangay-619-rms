import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js"
import authRoutes from "./modules/auth/auth.routes.js";
import residentRoutes from "./modules/residents/resident.routes.js";
import residentArchiveRoutes from "./modules/residents/residentArchive.routes.js";
import householdRoutes from "./modules/households/household.routes.js";
import familyRoutes from "./modules/family/family.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";
import householdNumberRoutes from "./modules/households/householdNumber.routes.js";
import officialRoutes from "./modules/officials/official.routes.js";
import barangayInfoRoutes from "./modules/barangay-info/barangayInfo.routes.js";

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

//Resident Archive Route
app.use("/api/archives", residentArchiveRoutes);

//Household Route
app.use("/api/households", householdRoutes);

//Household Number Route
app.use("/api/household-numbers", householdNumberRoutes);

//Family Route
app.use("/api/families", familyRoutes);

//Audit Trail Route
app.use("/api/audit-logs", auditRoutes);

//Official Route (Admin Only)
app.use("/api/officials", officialRoutes);

//Barangay Info Route
app.use("/api/barangay-info", barangayInfoRoutes);

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