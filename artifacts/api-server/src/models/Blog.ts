import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  content?: string;
  coverImageUrl?: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  sortOrder: number;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    content: String,
    coverImageUrl: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    readingTime: Number,
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

export const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
