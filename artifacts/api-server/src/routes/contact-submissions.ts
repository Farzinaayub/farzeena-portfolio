import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { ContactSubmission } from "../models/ContactSubmission.js";

const router = Router();

// GET /api/contact-submissions
router.get("/", async (_req, res) => {
  try {
    await connectMongoose();
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

// DELETE /api/contact-submissions (bulk)
router.delete("/", async (req, res) => {
  try {
    await connectMongoose();
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "ids array required" });
    }
    await ContactSubmission.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

// DELETE /api/contact-submissions/:id
router.delete("/:id", async (req, res) => {
  try {
    await connectMongoose();
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

// PATCH /api/contact-submissions/:id
router.patch("/:id", async (req, res) => {
  try {
    await connectMongoose();
    const { read } = req.body;
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!submission) return res.status(404).json({ error: "Not found" });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
