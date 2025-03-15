// routes/adminRoutes.js
import express from "express";
import {
  adminLogin,
  getClaimHistory,
  adminRegister,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/claims", authMiddleware, getClaimHistory);

export default router;
