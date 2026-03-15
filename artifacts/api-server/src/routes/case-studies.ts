import { Router } from "express";
import slugify from "slugify";
import { connectMongoose } from "../lib/mongoose.js";
import { CaseStudy } from "../models/CaseStudy.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await connectMongoose();
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured !== undefined)
      filter.featured = req.query.featured === "true";
    const items = await CaseStudy.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    await connectMongoose();
    const { title, slug: inputSlug, ...rest } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const slug =
      inputSlug ||
      slugify(title, { lower: true, strict: true, trim: true });
    const item = await CaseStudy.create({ title, slug, ...rest });
    res.status(201).json(item);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return res.status(400).json({ error: "Slug already exists" });
    }
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await connectMongoose();
    const { id } = req.params;
    const item =
      (await CaseStudy.findById(id).catch(() => null)) ||
      (await CaseStudy.findOne({ slug: id }));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await connectMongoose();
    const item = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await connectMongoose();
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
