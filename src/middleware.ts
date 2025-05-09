import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

// Protect routes that require authentication
export const config = {
  matcher: [
    "/profile/:path*",
    "/my-events/:path*",
    "/events/create",
    "/events/edit/:path*",
    "/admin/:path*",
  ],
};