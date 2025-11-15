import AllData from "@/app/dashboard/models/AllData";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Params interface
interface Params {
  section: string;
}

export async function PATCH(
  req: Request,
  context: { params: Promise<Params> }
): Promise<NextResponse> {
  try {
    const { section } = await context.params;

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const sectionName = section.toLowerCase();

    // MongoDB connect
    await connectDB();

    // Request body parsing
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

    // ✅ Update object including moreVideosUrl
    const updateObj: any = { data: body.data };

    if (body.heading) updateObj.heading = body.heading;
    if (body.moreVideosUrl !== undefined)
      updateObj.moreVideosUrl = body.moreVideosUrl;

    // MongoDB update
    const updatedSection = await AllData.findOneAndUpdate(
      { section: sectionName },
      { $set: updateObj },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Response
    return NextResponse.json({
      success: true,
      message: `Section "${sectionName}" updated successfully`,
      section: updatedSection
        ? {
            heading: updatedSection.heading || {},
            data: updatedSection.data,
            moreVideosUrl: updatedSection.moreVideosUrl || null,
          }
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
