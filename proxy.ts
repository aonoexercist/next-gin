import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard"];



export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies
  const accessToken = request.cookies.get("access_token")?.value

  // Protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Public routes
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // 🚫 If NOT logged in and trying to access protected route
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 🔁 If logged in and trying to access login/register
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/api/:path*"],
}