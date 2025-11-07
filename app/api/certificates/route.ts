import Certificate from "@/app/dashboard/models/Certificate";
import { connectDB } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  if (req.method === "GET") {
    const certificates = await Certificate.find({});
    return res.status(200).json(certificates);
  }

  if (req.method === "POST") {
    try {
      const newCert = await Certificate.create(req.body);
      return res.status(201).json(newCert);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Certificate creation failed" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
