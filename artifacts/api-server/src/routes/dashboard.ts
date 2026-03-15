import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { Blog } from "../models/Blog.js";
import { ContactSubmission } from "../models/ContactSubmission.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    await connectMongoose();
    const [publishedCaseStudies, publishedBlogs, unreadSubmissions, totalSubmissions] =
      await Promise.all([
        CaseStudy.countDocuments({ status: "published" }),
        Blog.countDocuments({ status: "published" }),
        ContactSubmission.countDocuments({ read: false }),
        ContactSubmission.countDocuments(),
      ]);
    res.json({ publishedCaseStudies, publishedBlogs, unreadSubmissions, totalSubmissions });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
