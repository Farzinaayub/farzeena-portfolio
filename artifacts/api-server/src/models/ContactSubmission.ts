import mongoose, { Schema, Document } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  projectType: string[];
  message: string;
  read: boolean;
  createdAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectType: [String],
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema
  );
