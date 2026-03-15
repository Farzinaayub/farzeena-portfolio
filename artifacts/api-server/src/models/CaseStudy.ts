import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  content?: string;
  coverImageUrl?: string;
  tools: string[];
  status: "draft" | "published";
  featured: boolean;
  sortOrder: number;
  documentUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    content: String,
    coverImageUrl: String,
    tools: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    documentUrl: String,
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

export const CaseStudy =
  mongoose.models.CaseStudy ||
  mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
