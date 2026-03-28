import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSection extends Document {
  heading: string;
  badgeText?: string;
  introText?: string;
  subtitle?: string;
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  pipelineSteps: { label: string; iconName: string; order: number }[];
  toolIcons: { name: string; iconUrl: string; order: number }[];
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    heading: { type: String, default: "" },
    badgeText: String,
    introText: String,
    subtitle: String,
    cta1Text: String,
    cta1Link: String,
    cta2Text: String,
    pipelineSteps: [
      {
        label: String,
        iconName: String,
        order: Number,
      },
    ],
    toolIcons: [
      {
        name: String,
        iconUrl: String,
        order: Number,
      },
    ],
  },
  { timestamps: true }
);

export const HeroSection =
  mongoose.models.HeroSection ||
  mongoose.model<IHeroSection>("HeroSection", HeroSectionSchema);
