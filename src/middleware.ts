import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const ignorePaths = [
    '/favicon.ico',
    /^\/_next\//,
    /^\/api\//,
    /\.(.*)$/,
  ];
  const shouldIgnore = ignorePaths.some(pattern =>
    pattern instanceof RegExp ? pattern.test(pathname) : pathname === pattern
  );
  if (shouldIgnore) return NextResponse.next();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (token) {
    const payload = await verifyToken(token);

    if (!payload) {
      const response = isAuthPage
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));

      response.cookies.set("token", "", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
      });

      return response;
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
