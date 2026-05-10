import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type CookieUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  type: "ADMIN" | "SUPER_ADMIN" | string;
};
// This function can be marked `async` if using `await` inside
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
      const user = JSON.parse(userCookie) as CookieUser;
      
      if (pathname.startsWith('/super-admin/dashboard') &&  !(user?.type === 'ADMIN')) {
        const loginUrl = new URL("/sign-in", req.url);
        loginUrl.searchParams.set("redirect", pathname);

        return NextResponse.redirect(loginUrl);
      }

    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/dashboard/:path*",
        "/super-admin/dashboard/:path*",
    ],
}