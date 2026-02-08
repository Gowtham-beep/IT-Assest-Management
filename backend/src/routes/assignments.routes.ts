import { Router } from "express";
import { listAssignments, listAssetsByUser } from "../controllers/assignments.controller.js";

const router = Router();

router.get("/", listAssignments);
router.get("/users/:id/assets", listAssetsByUser);

export default router;
