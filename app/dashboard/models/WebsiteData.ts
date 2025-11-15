import mongoose from "mongoose";

const websiteDataSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    heading: {
      title: String,
      subTitle: String,
    },
    data: mongoose.Schema.Types.Mixed,
    moreVideosUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.WebsiteData ||
  mongoose.model("WebsiteData", websiteDataSchema);
