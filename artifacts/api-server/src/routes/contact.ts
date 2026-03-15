import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { ContactSubmission } from "../models/ContactSubmission.js";

const router = Router();

// POST /api/contact — public form submission
router.post("/", async (req, res) => {
  try {
    await connectMongoose();
    const { name, email, projectType, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    await ContactSubmission.create({ name, email, projectType, message });
    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
