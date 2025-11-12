import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Cookie মুছে ফেলো
  res.cookies.set("loggedIn", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
