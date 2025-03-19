import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow certain routes unconditionally:
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Check for token
  const token = req.cookies.get("myapp-token")?.value;
  if (!token) {
    // Build a /login?from={originalPath} URL
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);

    // Optionally, also preserve query string if you want
    // e.g., if there were extra query params
    // for (const [key, value] of searchParams.entries()) {
    //   loginUrl.searchParams.set(key, value);
    // }

    return NextResponse.redirect(loginUrl);
  }

  // If there's a token, just proceed
  return NextResponse.next();
}

// (Optional) specify which routes the middleware applies to
export const config = {
  matcher: ["/(.*)"],
};
