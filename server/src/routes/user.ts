import express from "express";
import User from "../models/User";
import { verifyToken } from "../utils/auth";
import bcrypt from "bcryptjs";

const router = express.Router();

// Middleware to verify token
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  next();
};

// Get profile
router.get("/profile", authenticate, async (req: any, res) => {
  res.json({ success: true, user: req.user });
});

// Update profile
router.patch("/profile", authenticate, async (req: any, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["name", "bio", "role", "githubUrl", "linkedinUrl", "portfolioUrl", "avatar"];
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        req.user[field] = updates[field];
      }
    });

    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings (password, notifications, privacy)
router.patch("/settings", authenticate, async (req: any, res) => {
  try {
    const { action, ...data } = req.body;

    if (action === "updatePassword") {
      const { currentPassword, newPassword } = data;
      const isMatch = await bcrypt.compare(currentPassword, req.user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
      req.user.password = await bcrypt.hash(newPassword, 12);
      await req.user.save();
      return res.json({ success: true, message: "Password updated" });
    }

    if (action === "updateSettings") {
      if (data.notifications) req.user.notifications = data.notifications;
      if (data.privacyPrefs) req.user.privacyPrefs = data.privacyPrefs;
      await req.user.save();
      return res.json({ success: true, user: req.user });
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.delete("/delete", authenticate, async (req: any, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity
router.get("/activity", authenticate, async (req: any, res) => {
  // Return dummy activity for now
  res.json({ success: true, activity: [] });
});

// Add XP
router.post("/xp", authenticate, async (req: any, res) => {
  try {
    const { amount } = req.body;
    req.user.xp = (req.user.xp || 0) + amount;
    
    // Level up logic (1000 XP per level)
    req.user.level = Math.floor(req.user.xp / 1000) + 1;
    
    await req.user.save();
    res.json({ success: true, xp: req.user.xp, level: req.user.level });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard (Top 10 by XP)
router.get("/leaderboard", async (req, res) => {
  try {
    const topUsers = await User.find({ isPublic: { $ne: false } })
      .sort({ xp: -1 })
      .limit(10)
      .select("name username avatar xp level bio");
    
    res.json({ success: true, users: topUsers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
