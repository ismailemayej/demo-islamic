import mongoose, { Schema, model, models } from "mongoose";

const headingSchema = new Schema({
  section: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  subTitle: { type: String, default: "" },
});

const Heading = models.Heading || model("Heading", headingSchema);

export default Heading;
