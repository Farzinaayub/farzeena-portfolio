import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import caseStudiesRouter from "./case-studies.js";
import blogsRouter from "./blogs.js";
import heroRouter from "./hero.js";
import aboutRouter from "./about.js";
import siteSettingsRouter from "./site-settings.js";
import contactRouter from "./contact.js";
import contactSubmissionsRouter from "./contact-submissions.js";
import dashboardRouter from "./dashboard.js";
import { connectMongoose } from "../lib/mongoose.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { Blog } from "../models/Blog.js";
import { ContactSubmission } from "../models/ContactSubmission.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/case-studies", caseStudiesRouter);
router.use("/blogs", blogsRouter);
router.use("/hero", heroRouter);
router.use("/about", aboutRouter);
router.use("/site-settings", siteSettingsRouter);
router.use("/contact", contactRouter);
router.use("/contact-submissions", contactSubmissionsRouter);
router.use("/dashboard", dashboardRouter);

// Alias matching the generated API client path
router.get("/dashboard-stats", async (_req, res) => {
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
