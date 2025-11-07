import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Heading from "@/app/dashboard/models/Heading";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { section } = req.query;
  if (!section || typeof section !== "string") {
    return res.status(400).json({ error: "Section is required" });
  }

  if (req.method === "GET") {
    const heading = await Heading.findOne({ section });
    return res
      .status(200)
      .json(heading || { section, title: "", subTitle: "" });
  }

  if (req.method === "PUT") {
    const { title, subTitle } = req.body;
    if (!title || !subTitle) {
      return res.status(400).json({ error: "Title and SubTitle are required" });
    }

    const updatedHeading = await Heading.findOneAndUpdate(
      { section },
      { title, subTitle },
      { upsert: true, new: true } // upsert=true: নতুন section এ data সেভ হবে
    );

    return res.status(200).json({ updatedHeading });
  }

  res.status(405).json({ error: "Method not allowed" });
}
