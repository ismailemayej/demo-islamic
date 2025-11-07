import { NextResponse } from "next/server";

import Profile from "@/app/dashboard/models/Profile";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().sort({ _id: -1 });
  return NextResponse.json(profile);
}
