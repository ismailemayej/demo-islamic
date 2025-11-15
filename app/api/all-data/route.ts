import AllData from "@/app/dashboard/models/AllData";
import connectDB from "@/lib/mongodb";
import { WebsiteData } from "@/types/allData";

export async function GET() {
  await connectDB();
  const allData = await AllData.find();
  return Response.json(allData);
}

export async function POST(req: Request) {
  await connectDB();
  const body: WebsiteData[] = await req.json();

  const created = await AllData.insertMany(body);
  return Response.json(created);
}
