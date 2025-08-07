import { NextResponse } from "next/server"

export async function GET() {
    const res = NextResponse.json({ success: true })
    res.cookies.set("token", "", { path: "/", maxAge: 0 }) // expire it
    return res
}
