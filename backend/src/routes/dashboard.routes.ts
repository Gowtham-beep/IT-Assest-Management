import { Router } from "express";
import { dashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", dashboardStats);

export default router;
