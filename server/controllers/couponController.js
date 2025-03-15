// controllers/couponController.js
import Coupon from "../models/Coupon.js";
import Claim from "../models/Claim.js";

export const claimCoupon = async (req, res) => {
  const ip = req.ip;
  const { couponId, browserSession } = req.body;
  const existingClaim = await Claim.findOne({
    $or: [{ ip }, { browserSession }],
  });
  if (existingClaim)
    return res
      .status(403)
      .json({ message: "You have already claimed a coupon." });

  const coupon = await Coupon.findById(couponId);
  if (!coupon || coupon.claimed)
    return res.status(404).json({ message: "Coupon not available" });

  coupon.claimed = true;
  await coupon.save();

  await Claim.create({ ip, browserSession, couponId });
  res.json({ message: "Coupon claimed successfully!" });
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

export const addCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const newCoupon = await Coupon.create({ code });
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: "Error adding coupon" });
  }
};

export const toggleCouponAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.available = !coupon.available;
    await coupon.save();
    res.json({ message: "Coupon availability toggled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon status" });
  }
};
