import mongoose, { Schema, model, models } from "mongoose";

interface ICertificate {
  CertificateName: string;
  InstituteName: string;
  Year: string;
  Description?: string;
  Image?: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    CertificateName: { type: String, required: true },
    InstituteName: { type: String, required: true },
    Year: { type: String, required: true },
    Description: { type: String },
    Image: { type: String },
  },
  { timestamps: true }
);

const Certificate =
  models.Certificate || model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
