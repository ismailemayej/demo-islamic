import mongoose, { Schema, models } from "mongoose";

const achievementSchema = new Schema(
  {
    title: { type: String, required: true },
    count: { type: Number, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

const Achievement =
  models.Achievement || mongoose.model("Achievement", achievementSchema);
export default Achievement;
