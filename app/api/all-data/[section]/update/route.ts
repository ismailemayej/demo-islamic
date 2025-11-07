import AllData from "@/app/dashboard/models/AllData";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface Params {
  section: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    if (!params?.section) {
      return NextResponse.json(
        { success: false, error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const sectionName = params.section.toLowerCase();
    await connectDB();

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || !body.data) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const updateObj: any = { data: body.data };
    if (body.heading) updateObj.heading = body.heading;

    const updatedSection = await AllData.findOneAndUpdate(
      { section: sectionName },
      { $set: updateObj },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Section "${sectionName}" updated successfully`,
      section: updatedSection
        ? { heading: updatedSection.heading || {}, data: updatedSection.data }
        : null,
    });
  } catch (error) {
    console.error("PATCH /api/all-data/[section]/update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
