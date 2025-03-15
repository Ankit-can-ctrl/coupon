// routes/couponRoutes.js
import express from "express";
import {
  claimCoupon,
  getCoupons,
  addCoupon,
  toggleCouponAvailability,
} from "../controllers/couponController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCoupons);
router.post("/claim", claimCoupon);
router.post("/add", authMiddleware, addCoupon);
router.put("/toggle/:id", authMiddleware, toggleCouponAvailability);

export default router;
