import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { SiteSettings } from "../models/SiteSettings.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await connectMongoose();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        siteTitle: "Farzeena — Analytics Engineer",
        ctaBannerText: "Testing Analytics Insights",
        footerText: "© 2025 Farzeena. All rights reserved.",
        linkedinUrl: "https://www.linkedin.com/in/farzeena-ayub/",
        githubUrl: "https://github.com/Farzinaayub",
        twitterUrl: "",
        contactEmail: "hello@farzeena.com",
        metaTitleTemplate: "%s | Farzeena",
        defaultMetaDescription:
          "Analytics Engineer specializing in data pipelines, analytics models, and dashboards.",
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.put("/", async (req, res) => {
  try {
    await connectMongoose();
    let settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await SiteSettings.create(req.body);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
