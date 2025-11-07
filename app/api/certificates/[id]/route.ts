import Certificate from "@/app/dashboard/models/Certificate";
import { connectDB } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const cert = await Certificate.findById(id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    return res.status(200).json(cert);
  }

  if (req.method === "PUT") {
    try {
      const updatedCert = await Certificate.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({ updatedCert });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Update failed" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Certificate.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Delete failed" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
