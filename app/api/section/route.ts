import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await connectDB();
  const db = client.db("demo-customize");
  const collection = db.collection("all-data");

  const sectionName = req.query.name as string;

  if (req.method === "GET") {
    // Fetch section
    const section = await collection.findOne({ section: sectionName });
    return res.status(200).json(section);
  }

  if (req.method === "PUT") {
    // Update section (whole section or single object type)
    const { _id, ...rest } = req.body;
    if (!_id)
      return res.status(400).json({ success: false, message: "_id missing" });

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: rest }
    );

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "No document found to update" });

    const updatedDoc = await collection.findOne({ _id: new ObjectId(_id) });
    return res.status(200).json({ success: true, updatedDoc });
  }

  if (req.method === "POST") {
    // Add item to array section
    const { section, newItem } = req.body;
    if (!section || !newItem)
      return res
        .status(400)
        .json({ success: false, message: "Missing section or newItem" });

    const result = await collection.updateOne(
      { section },
      { $push: { data: newItem } }
    );

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    const updatedDoc = await collection.findOne({ section });
    return res.status(200).json({ success: true, updatedDoc });
  }

  if (req.method === "DELETE") {
    // Delete item from array section
    const { section, key, value } = req.body; // key-value pair to match item
    if (!section || !key || !value)
      return res
        .status(400)
        .json({ success: false, message: "Missing section, key, or value" });

    const result = await collection.updateOne(
      { section },
      { $pull: { data: { [key]: value } } as any }
    );

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    const updatedDoc = await collection.findOne({ section });
    return res.status(200).json({ success: true, updatedDoc });
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}
