import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image URL provided" },
        { status: 400 }
      );
    }

    // URL থেকে public_id বের করা
    // উদাহরণ: https://res.cloudinary.com/<cloud_name>/image/upload/v1699999999/dashboard-certificates/filename.jpg
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1]; // filename.jpg
    const publicId = `dashboard-certificates/${filename.split(".")[0]}`; // folder/filename (extension ছাড়াই)

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
