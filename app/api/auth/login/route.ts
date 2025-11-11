import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { loggedIn } = await req.json();

  const res = NextResponse.json({ success: true });

  // Set HttpOnly cookie
  res.cookies.set({
    name: "loggedIn",
    value: loggedIn ? "true" : "false",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
