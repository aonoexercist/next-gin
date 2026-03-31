import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL!

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params

  const url = `${API_URL}/${path.join("/")}`

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
  })

  const data = await res.text()

  const response = new NextResponse(data, {
    status: res.status,
  })

  const setCookie = res.headers.get("set-cookie")
  if (setCookie) {
    response.headers.set("set-cookie", setCookie)
  }

  return response
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
}