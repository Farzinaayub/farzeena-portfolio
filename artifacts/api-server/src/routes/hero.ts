import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { HeroSection } from "../models/HeroSection.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await connectMongoose();
    let hero = await HeroSection.findOne();
    if (hero) {
      let needsSave = false;
      if (!hero.badgeText) { hero.badgeText = "Analytics Engineer · Data & Business Intelligence"; needsSave = true; }
      if (!hero.introText) { hero.introText = "Hi, I'm Farzeena — I help data teams"; needsSave = true; }
      if (!hero.cta2Text || hero.cta2Text === "Explore Solutions") { hero.cta2Text = "About Me"; needsSave = true; }
      if (needsSave) await hero.save();
    }
    if (!hero) {
      hero = await HeroSection.create({
        heading: "",
        badgeText: "Analytics Engineer · Data & Business Intelligence",
        introText: "Hi, I'm Farzeena — I help data teams",
        subtitle:
          "Designing data pipelines, analytics models, and dashboards to transform raw data into business insights.",
        cta1Text: "View Case Studies",
        cta1Link: "/case-studies",
        cta2Text: "About Me",
        pipelineSteps: [
          { label: "Analytics Engineering for Data-Driven Decisions", iconName: "", order: 0 },
          { label: "Transforming Raw Data into Business Intelligence", iconName: "", order: 1 },
          { label: "Building Scalable Pipelines & BI Dashboards", iconName: "", order: 2 },
          { label: "Helping Teams Make Confident Data-Backed Decisions", iconName: "", order: 3 },
        ],
        toolIcons: [],
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
