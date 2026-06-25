import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_BASE = "/kower-admin-2026";
const LOGIN_PATH = `${ADMIN_BASE}/login`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block admin panel from being framed (extra clickjacking protection)
  if (pathname.startsWith(ADMIN_BASE)) {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kower-admin-2026/:path*"],
};
