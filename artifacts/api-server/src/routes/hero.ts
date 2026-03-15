import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { HeroSection } from "../models/HeroSection.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await connectMongoose();
    let hero = await HeroSection.findOne();
    if (!hero) {
      hero = await HeroSection.create({
        heading: "Analytics Engineering for Data-Driven Decision Making",
        subtitle:
          "Designing data pipelines, analytics models, and dashboards to transform raw data into business insights.",
        cta1Text: "View Case Studies",
        cta1Link: "/case-studies",
        cta2Text: "Explore Solutions",
        cta2Link: "/about",
        pipelineSteps: [
          { label: "Data Sources", iconName: "Database", order: 0 },
          { label: "Python ETL", iconName: "Code", order: 1 },
          { label: "Data Warehouse", iconName: "Server", order: 2 },
          { label: "Dashboard", iconName: "BarChart2", order: 3 },
        ],
        toolIcons: [
          { name: "dbt", iconUrl: "", order: 0 },
          { name: "Python", iconUrl: "", order: 1 },
          { name: "Power BI", iconUrl: "", order: 2 },
          { name: "Google Cloud", iconUrl: "", order: 3 },
          { name: "AWS", iconUrl: "", order: 4 },
        ],
      });
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.put("/", async (req, res) => {
  try {
    await connectMongoose();
    let hero = await HeroSection.findOne();
    if (hero) {
      Object.assign(hero, req.body);
      await hero.save();
    } else {
      hero = await HeroSection.create(req.body);
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
