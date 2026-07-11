import { NextRequest, NextResponse } from "next/server";

type CookieUser = {
  id: number;
  type: "ADMIN" | "TENANT" | "EMPLOYEE";
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("refreshToken")?.value;
  const userCookie = req.cookies.get("user")?.value;

  // login check
  if (!token || !userCookie) {
    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // admin check
  let user: CookieUser;

  try {
    user = JSON.parse(userCookie) as CookieUser;
  } catch {
    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith("/super-admin/dashboard") &&
    !(user?.type === "ADMIN")
  ) {
    const loginUrl = new URL("/super-admin/sign-in", req.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/dashboard") && user?.type === "ADMIN") {
    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/super-admin/dashboard/:path*"],
};
