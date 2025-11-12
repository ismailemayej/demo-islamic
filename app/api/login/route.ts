import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data/usersection`,
      {
        cache: "no-store",
      }
    );
    const section = await res.json();
    const user = section.groupedData?.usersection.data.user;
    const pass = section.groupedData?.usersection.data.password;

    if (email === user && password === pass) {
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      response.cookies.set("loggedIn", "true", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error!" },
      { status: 500 }
    );
  }
}
