import { Router } from "express";
import slugify from "slugify";
import { connectMongoose } from "../lib/mongoose.js";
import { Blog } from "../models/Blog.js";

const router = Router();

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

router.get("/", async (req, res) => {
  try {
    await connectMongoose();
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured !== undefined)
      filter.featured = req.query.featured === "true";
    const items = await Blog.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    await connectMongoose();
    const { title, slug: inputSlug, content, ...rest } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const slug =
      inputSlug ||
      slugify(title, { lower: true, strict: true, trim: true });
    const readingTime = content ? estimateReadingTime(content) : 1;
    const item = await Blog.create({ title, slug, content, readingTime, ...rest });
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
      (await Blog.findById(id).catch(() => null)) ||
      (await Blog.findOne({ slug: id }));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await connectMongoose();
    const { content, ...rest } = req.body;
    const readingTime = content ? estimateReadingTime(content) : undefined;
    const update = readingTime
      ? { ...rest, content, readingTime }
      : { ...rest, content };
    const item = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await connectMongoose();
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: String(err) });
  }
});

export default router;
