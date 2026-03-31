"use client"

import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import GoogleOneTapButton from "./components/GoogleOneTapButton"

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleOneTapButton />
      {children}
    </GoogleOAuthProvider>
  )
}
