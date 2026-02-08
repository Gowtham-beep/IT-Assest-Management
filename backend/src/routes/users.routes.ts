import { Router } from "express";
import { createUser, getUser, listUsers, updateUser } from "../controllers/users.controller.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listUsers);
router.post("/", requireRole("admin", "it_staff"), createUser);
router.get("/:id", getUser);
router.put("/:id", requireRole("admin", "it_staff"), updateUser);

export default router;
