import { Router } from "express";
import {
  approveRequest,
  createRequest,
  fulfillRequest,
  listRequests,
  rejectRequest
} from "../controllers/requests.controller.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listRequests);
router.post("/", createRequest);
router.put("/:id/approve", requireRole("admin", "it_staff"), approveRequest);
router.put("/:id/reject", requireRole("admin", "it_staff"), rejectRequest);
router.put("/:id/fulfill", requireRole("admin", "it_staff"), fulfillRequest);

export default router;
