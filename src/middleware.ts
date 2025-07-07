import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get("authToken")?.value;
  
  // If no token is found, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  // If token exists, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Protect all routes under (with-layout)
  matcher: [
    "/home/:path*",
    "/categories/:path*",
    "/questionaire/:path*",
    "/question-sets/:path*",
    "/trivia/:path*",
    "/tambola/:path*",
    "/wheel-of-fortune/:path*",
    "/rewards-management/:path*",
    "/userlist/:path*",
    "/view/:path*"
  ],
};