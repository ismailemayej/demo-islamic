import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get("loggedIn")?.value;

  // ✅ যদি লগইন না করা থাকে এবং /dashboard অ্যাক্সেস করে
  if (req.nextUrl.pathname.startsWith("/dashboard") && loggedIn !== "true") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ যদি লগইন করা থাকে এবং login পেজে যায়
  if (req.nextUrl.pathname.startsWith("/login") && loggedIn === "true") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // যেসব রাউটে Middleware কাজ করবে
};
