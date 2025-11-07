import AllData from "@/app/dashboard/models/AllData";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface Params {
  section: string;
}

export async function GET(_req: Request, context: { params: Params }) {
  try {
    const params = context.params; // ✅ ensure params exists
    if (!params?.section) {
      return NextResponse.json(
        { success: false, error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const sectionName = params.section.toLowerCase();

    await connectDB();

    const sectionDoc = await AllData.findOne({ section: sectionName });
    if (!sectionDoc) {
      return NextResponse.json(
        { success: false, error: `Section "${sectionName}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      totalSections: 1,
      groupedData: {
        [sectionName]: {
          heading: sectionDoc.heading,
          data: sectionDoc.data,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch section data" },
      { status: 500 }
    );
  }
}
