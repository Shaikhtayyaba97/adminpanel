import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin-auth"); // Token ko cookies me check karein

  if (!token) {
    // Agar token nahi hai to login page par redirect karein
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Agar token hai to request ko aage badhne dein
  return NextResponse.next();
}

// Protect sirf /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};