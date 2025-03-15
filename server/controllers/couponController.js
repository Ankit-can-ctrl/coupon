// controllers/couponController.js
import Coupon from "../models/Coupon.js";
import Claim from "../models/Claim.js";

export const assignCoupon = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;

    // Check if user already has a coupon assigned
    const existingClaim = await Coupon.findOne({ assignedIp: ip });

    if (existingClaim) {
      return res.json({ coupon: existingClaim });
    }

    // Assign next available coupon (round-robin)
    const coupon = await Coupon.findOneAndUpdate(
      { claimed: false, assignedIp: null }, // Find an unclaimed coupon
      { $set: { assignedIp: ip }, $inc: { usedCount: 1 } }, // Assign to IP, increment usage count
      { sort: { usedCount: 1, createdAt: 1 }, new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "No coupons available" });
    }

    res.json({ coupon });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const claimCoupon = async (req, res) => {
  try {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { browserSession } = req.body;

    // Check if user already claimed a coupon
    const existingClaim = await Claim.findOne({
      $or: [{ ip }, { browserSession }],
    });

    if (existingClaim) {
      return res
        .status(403)
        .json({ message: "You have already claimed this coupon." });
    }

    // Find next available coupon (round-robin)
    const coupon = await Coupon.findOneAndUpdate(
      { claimed: false }, // Find an unclaimed coupon
      { $inc: { usedCount: 1 }, $set: { claimed: true } }, // Increment `usedCount` and mark as claimed
      { sort: { usedCount: 1, createdAt: 1 }, new: true } // Prioritize least-used coupons
    );

    if (!coupon) {
      return res.status(404).json({
        message:
          "No coupons available or coupon have been claimed. Please check back later.",
      });
    }

    // Store claim record
    await Claim.create({ ip, browserSession, couponId: coupon._id });

    res.json({ message: "Coupon claimed successfully!", coupon: coupon.code });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

export const addCoupon = async (req, res) => {
  try {
    let { code } = req.body;
    code = code.toUpperCase();

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
