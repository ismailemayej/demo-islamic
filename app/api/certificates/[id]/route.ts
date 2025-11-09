import Certificate from "@/app/dashboard/models/Certificate";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Params interface
interface Params {
  id: string;
}

// GET / PUT / DELETE handler
export async function GET(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;

    await connectDB();

    const cert = await Certificate.findById(id);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cert);
  } catch (error) {
    console.error("GET certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    await connectDB();

    const updatedCert = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedCert) {
      return NextResponse.json(
        { error: "Certificate not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ updatedCert });
  } catch (error) {
    console.error("PUT certificate error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const deleted = await Certificate.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Certificate not found or delete failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE certificate error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
