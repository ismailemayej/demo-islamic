import mongoose, { Schema, models } from "mongoose";

const heroSchema = new Schema(
  {
    heading: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
    },
    herodata: {
      image: { type: String, required: true },
      name: { type: String, required: true },
      slogan: { type: String, required: true },
      description: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Hero = models.Hero || mongoose.model("Hero", heroSchema);
export default Hero;
