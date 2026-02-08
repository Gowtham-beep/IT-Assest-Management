import { Router } from "express";
import {
  assignAsset,
  createAsset,
  getAsset,
  listAssets,
  retireAsset,
  returnAsset,
  searchAssets,
  updateAsset
} from "../controllers/assets.controller.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listAssets);
router.get("/search", searchAssets);
router.get("/:id", getAsset);
router.post("/", requireRole("admin", "it_staff"), createAsset);
router.put("/:id", requireRole("admin", "it_staff"), updateAsset);
router.delete("/:id", requireRole("admin", "it_staff"), retireAsset);
router.post("/:id/assign", requireRole("admin", "it_staff"), assignAsset);
router.post("/:id/return", requireRole("admin", "it_staff"), returnAsset);

export default router;
