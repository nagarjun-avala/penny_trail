import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from '@/lib/db';
import { encrypt } from "@/lib/session";

export async function POST(req: Request) {
    const { email, password, name } = await req.json()

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await db.user.create({
        data: { email, password: hashed, name },
    })

    const token = await encrypt({ id: user.id, email: user.email });
    const res = NextResponse.json({ success: true, message: "User registered successfully" })
    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    })
    return res
}
