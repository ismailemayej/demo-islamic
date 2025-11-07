import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  authorName: string;
  description: string;
  date: string;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);
