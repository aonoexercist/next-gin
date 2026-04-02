"use client"

import { googleLogin } from "@/lib/auth"
import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"

export default function GoogleLoginButton() {
  const router = useRouter()

  return (
    <GoogleLogin
      useOneTap={true}
      onSuccess={async (credentialResponse) => {
        const idToken = credentialResponse?.credential
        if (!idToken) return
        try {
          await googleLogin(idToken)
          router.push("/dashboard")
        } catch (err) {
          console.error(err)
          alert("Google login failed")
        }
      }}
    />
  )
}
