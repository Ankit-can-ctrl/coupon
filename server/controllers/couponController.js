// controllers/couponController.js
import Coupon from "../models/Coupon.js";
import Claim from "../models/Claim.js";

export const assignCoupon = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;

    const alreadyClaimed = await Claim.findOne({ ip });
    if (alreadyClaimed) {
      return res
        .status(403)
        .json({ message: "You have already claimed this coupon." });
    }

    // Check if user already has a coupon assigned
    const existingClaim = await Coupon.findOne({ assignedIp: ip });

    if (existingClaim) {
      return res.json({ coupon: existingClaim });
    }

    // Assign next available coupon (round-robin)
    const coupon = await Coupon.findOneAndUpdate(
      { claimed: false, assignedIp: null, isActive: true }, // Find an unclaimed coupon
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

const COOLDOWN_HOURS = 24; // Define cooldown period

export const claimCoupon = async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.connection?.remoteAddress ||
      req.ip;

    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    let { browserSession } = req.body;

    // If session cookie is not provided in the request body, check for it in cookies
    if (!browserSession && req.cookies.sessionId) {
      browserSession = req.cookies.sessionId;
    }

    // Check if this IP has already claimed a coupon within the cooldown period
    const lastClaim = await Claim.findOne({ ip }).sort({ claimedAt: -1 });

    if (lastClaim) {
      const timeSinceLastClaim =
        (Date.now() - new Date(lastClaim.claimedAt).getTime()) /
        (1000 * 60 * 60); // Convert to hours

      if (timeSinceLastClaim < COOLDOWN_HOURS) {
        const hoursRemaining = Math.ceil(COOLDOWN_HOURS - timeSinceLastClaim);
        return res.status(403).json({
          message: `Please wait ${hoursRemaining} hours before claiming another coupon.`,
        });
      }
    }

    // Check if the user has claimed a coupon in this session
    if (browserSession) {
      const sessionClaim = await Claim.findOne({ browserSession });
      if (sessionClaim) {
        return res.status(403).json({
          message: "You have already claimed a coupon in this session.",
        });
      }
    }

    // Find next available coupon using round-robin
    const coupon = await Coupon.findOneAndUpdate(
      {
        claimed: false,
        isActive: true,
      },
      {
        $set: { claimed: true },
        $inc: { usedCount: 1 },
      },
      {
        sort: { usedCount: 1, createdAt: 1 },
        new: true,
      }
    );

    if (!coupon) {
      return res.status(404).json({
        message: "No coupons available at the moment. Please try again later.",
      });
    }

    // Generate session ID if not provided
    const sessionId = browserSession || `session-${Date.now()}`;

    // Create claim record
    const newClaim = await Claim.create({
      ip,
      browserSession: sessionId,
      couponId: coupon._id,
      code: coupon.code,
      claimedAt: new Date(),
    });

    // Set session cookie if not already set
    if (!browserSession) {
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: COOLDOWN_HOURS * 60 * 60 * 1000, // Convert hours to milliseconds
        sameSite: "strict",
      });
    }

    return res.json({
      message: "Coupon claimed successfully!",
      coupon: {
        code: coupon.code,
        expiresIn: `${COOLDOWN_HOURS} hours`,
      },
    });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    return res.status(500).json({
      message: "An error occurred while claiming the coupon. Please try again.",
    });
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
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: "Coupon availability toggled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon status" });
  }
};

export const updateCouponCode = async (req, res) => {
  try {
    const { id } = req.params; // Extract coupon ID from request params
    let { code } = req.body; // Get new coupon code from request body

    if (!code || typeof code !== "string")
      return res.status(400).json({ message: "Invalid coupon code" });

    code = code.toUpperCase(); // Convert to uppercase before updating

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.code = code; // Update the coupon code
    await coupon.save(); // Save the updated coupon

    res.json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon code", error });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params; // Extract coupon ID from request params

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    await Coupon.findByIdAndDelete(id); // Delete the coupon from the database

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
};
