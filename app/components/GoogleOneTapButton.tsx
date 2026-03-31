"use client"

import { googleLogin } from "@/lib/auth"
import { useGoogleOneTapLogin } from "@react-oauth/google"

export default function GoogleOneTapButton() {
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      const idToken = credentialResponse.credential

      await googleLogin(idToken as string)

      // optional redirect
      window.location.href = "/dashboard"
    },

    onError: () => {
      console.log("One Tap failed")
    },
  })

  return null
}