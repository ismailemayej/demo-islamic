import mongoose, { Schema, models } from "mongoose";

const aboutSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description1: { type: String },
    description2: { type: String },
    description3: { type: String },
    image: { type: String },
    points: [{ type: String }],
  },
  { timestamps: true }
);

export const About = models.About || mongoose.model("About", aboutSchema);
