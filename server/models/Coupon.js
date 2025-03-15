// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  claimed: { type: Boolean, default: false }, // Track if claimed
  createdAt: { type: Date, default: Date.now },
  usedCount: { type: Number, default: 0 },
});

export default mongoose.model("Coupon", couponSchema);
