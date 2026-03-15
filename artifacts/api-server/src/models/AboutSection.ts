import mongoose, { Schema, Document } from "mongoose";

export interface IAboutSection extends Document {
  name: string;
  bio?: string;
  profileImageUrl?: string;
  focusAreas: { icon: string; text: string; order: number }[];
  industryTags: { label: string; order: number }[];
  updatedAt: Date;
}

const AboutSectionSchema = new Schema<IAboutSection>(
  {
    name: { type: String, required: true },
    bio: String,
    profileImageUrl: String,
    focusAreas: [
      {
        icon: String,
        text: String,
        order: Number,
      },
    ],
    industryTags: [
      {
        label: String,
        order: Number,
      },
    ],
  },
  { timestamps: true }
);

export const AboutSection =
  mongoose.models.AboutSection ||
  mongoose.model<IAboutSection>("AboutSection", AboutSectionSchema);
