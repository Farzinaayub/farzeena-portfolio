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
import authRoutesRouter from "./auth-routes.js";

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
router.use("/auth", authRoutesRouter);

export default router;
