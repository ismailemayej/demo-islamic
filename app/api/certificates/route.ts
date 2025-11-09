import Certificate from "@/app/dashboard/models/Certificate";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: fetch all certificates
export async function GET(req: Request) {
  try {
    await connectDB();

    const certificates = await Certificate.find({});

    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST: create a new certificate
export async function POST(req: Request) {
  try {
    await connectDB();

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const newCert = await Certificate.create(body);

    return NextResponse.json(newCert, { status: 201 });
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json(
      { error: "Certificate creation failed" },
      { status: 400 }
    );
  }
}
