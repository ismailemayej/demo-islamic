import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const loggedIn = req.cookies.get("loggedIn")?.value;

  // Protect dashboard route
  if (url.pathname.startsWith("/dashboard") && loggedIn !== "true") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
