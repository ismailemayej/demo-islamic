import AllData from "@/app/dashboard/models/AllData";
import connectDB from "@/lib/mongodb";

import { NextResponse } from "next/server";

// ⚡ TypeScript interface (optional, clarity purpose)
interface SectionParams {
  section: string;
}

// ✅ GET API handler for dynamic section
export async function GET(
  _req: Request,
  context: { params: Promise<SectionParams> }
) {
  try {
    const { section } = await context.params;
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const sectionName = section.toLowerCase();

    // ✅ MongoDB সংযোগ
    await connectDB();

    // 🔍 নির্দিষ্ট section ডকুমেন্ট বের করা
    const sectionDoc = await AllData.findOne({ section: sectionName });

    // ❌ যদি section না পাওয়া যায়
    if (!sectionDoc) {
      return NextResponse.json(
        { success: false, error: `Section "${sectionName}" not found` },
        { status: 404 }
      );
    }

    // ✅ সফল response
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
