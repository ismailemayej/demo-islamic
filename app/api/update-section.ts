// pages/api/update-section.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

type ResponseData = {
  success: boolean;
  message?: string;
  updatedDoc?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("demo-customize");
    const collection = db.collection("all-data");

    if (req.method === "PUT") {
      const { _id, ...rest } = req.body;

      if (!_id)
        return res
          .status(400)
          .json({ success: false, message: "_id is missing in request body" });

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
    } else {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("Update Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}
