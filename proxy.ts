import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/register"]
const protectedRoutes = ["/dashboard"]
const authRedirectRoutes = ["/", "/login", "/register"] // routes a logged-in user shouldn't see

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies
  const accessToken = request.cookies.get("access_token")?.value

  // Protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Routes that should redirect logged-in users to dashboard
  const isAuthRedirectRoute = authRedirectRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  )

  // 🚫 Not logged in and trying to access protected route
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 🔁 Logged in and trying to access "/", "/login", or "/register"
  if (isAuthRedirectRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Apply proxy to specific routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
}