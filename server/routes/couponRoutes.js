// routes/couponRoutes.js
import express from "express";
import {
  claimCoupon,
  getCoupons,
  addCoupon,
  toggleCouponAvailability,
  assignCoupon,
} from "../controllers/couponController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCoupons);
// Assign an unclaimed coupon to a user (Round Robin)
router.get("/assign", assignCoupon);
router.post("/claim", claimCoupon);
router.post("/add", authMiddleware, addCoupon);
router.put("/toggle/:id", authMiddleware, toggleCouponAvailability);

export default router;
