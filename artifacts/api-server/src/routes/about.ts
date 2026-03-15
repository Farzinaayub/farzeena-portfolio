import { Router } from "express";
import { connectMongoose } from "../lib/mongoose.js";
import { AboutSection } from "../models/AboutSection.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await connectMongoose();
    let about = await AboutSection.findOne();
    if (!about) {
      about = await AboutSection.create({
        name: "Farzeena",
        bio: "Analytics Engineer with 2+ years of experience in SQL, Python, and business intelligence. I design and build data pipelines, analytics models, and dashboards that support data-driven decision making.",
        profileImageUrl: "",
        focusAreas: [
          { icon: "BarChart2", text: "Analytics Engineering", order: 0 },
          { icon: "Code", text: "Advanced SQL", order: 1 },
          { icon: "Database", text: "Data Modeling", order: 2 },
        ],
        industryTags: [
          { label: "Airlines", order: 0 },
          { label: "Marketplaces", order: 1 },
          { label: "Ecommerce", order: 2 },
          { label: "Logistics", order: 3 },
          { label: "Supplier SQL", order: 4 },
          { label: "Real Estate", order: 5 },
        ],
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.put("/", async (req, res) => {
  try {
    await connectMongoose();
    let about = await AboutSection.findOne();
    if (about) {
      Object.assign(about, req.body);
      await about.save();
    } else {
      about = await AboutSection.create(req.body);
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
