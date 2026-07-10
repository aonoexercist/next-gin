import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;

    if (token) {
        return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ message: "Page Not Found" }, { status: 404 });
}