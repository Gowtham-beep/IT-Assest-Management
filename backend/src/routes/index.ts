import { Router } from "express";
import authRoutes from "./auth.routes.js";
import assetsRoutes from "./assets.routes.js";
import assignmentsRoutes from "./assignments.routes.js";
import requestsRoutes from "./requests.routes.js";
import usersRoutes from "./users.routes.js";
import reportsRoutes from "./reports.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTenant } from "../middleware/tenant.js";

const router = Router();

router.use("/auth", authRoutes);
router.use(requireAuth, requireTenant);
router.use("/assets", assetsRoutes);
router.use("/assignments", assignmentsRoutes);
router.use("/requests", requestsRoutes);
router.use("/users", usersRoutes);
router.use("/reports", reportsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
