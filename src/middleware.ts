// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // Jika sudah login tapi coba buka /admin/login, alihkan ke dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // Return true jika user memiliki token valid
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        if (isLoginPage) return true; // Izinkan akses ke halaman login
        return !!token; // Tolak akses /admin lainnya jika tidak ada token
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