// import { NextResponse } from "next/server";
// import connectDB from "@/lib/connectDB";
// import { AllData } from "@/models/AllData";
// import { websiteData } from "@/data/websiteData"; // তোমার JSON ডাটা এখানে থাকবে

// export async function POST() {
//   try {
//     await connectDB();
//     await AllData.insertMany(websiteData);
//     return NextResponse.json({ message: "✅ All data inserted successfully!" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
