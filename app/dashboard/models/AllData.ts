import { WebsiteData } from "@/types/allData";
import mongoose, { Schema, Document, Model } from "mongoose";

interface IAllData extends WebsiteData, Document {}

const allDataSchema = new Schema<IAllData>(
  {
    section: { type: String, required: true },
    heading: {
      title: String,
      subTitle: String,
    },
    data: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: "all-data",
  }
);

const AllData: Model<IAllData> =
  mongoose.models.AllData || mongoose.model<IAllData>("AllData", allDataSchema);

export default AllData;
