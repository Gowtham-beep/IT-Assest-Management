import { Router } from "express";
import { assignmentsReport, auditReport, inventoryReport } from "../controllers/reports.controller.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/inventory", requireRole("admin", "it_staff", "manager"), inventoryReport);
router.get("/assignments", requireRole("admin", "it_staff", "manager"), assignmentsReport);
router.get("/audit", requireRole("admin", "it_staff"), auditReport);

export default router;
