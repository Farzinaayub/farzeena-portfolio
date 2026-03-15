import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  siteTitle: string;
  ctaBannerText?: string;
  footerText?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  contactEmail?: string;
  metaTitleTemplate?: string;
  defaultMetaDescription?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteTitle: { type: String, required: true },
    ctaBannerText: String,
    footerText: String,
    linkedinUrl: String,
    githubUrl: String,
    twitterUrl: String,
    contactEmail: String,
    metaTitleTemplate: String,
    defaultMetaDescription: String,
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
