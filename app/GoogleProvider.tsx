"use client"

import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import GoogleOneTapButton from "./components/GoogleOneTapButton"
import { usePathname } from "next/navigation"

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

const NO_ONE_TAP_PATHS = ["/login", "/register"]

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showOneTap = !NO_ONE_TAP_PATHS.includes(pathname)

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {showOneTap && <GoogleOneTapButton />}
      {children}
    </GoogleOAuthProvider>
  )
}
