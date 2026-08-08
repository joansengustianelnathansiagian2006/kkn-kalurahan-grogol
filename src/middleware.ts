import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const isLoginPage = pathname === "/admin/login";

    // 1. Jika sudah login dan mencoba buka /admin/login, alihkan ke dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // 2. Jika mengakses /admin secara langsung dan sudah login, alihkan ke /admin/dashboard
    if (pathname === "/admin" && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        // Izinkan halaman login tanpa token, rute /admin/* lainnya wajib punya token
        if (isLoginPage) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};