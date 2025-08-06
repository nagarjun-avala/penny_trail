import { NextResponse } from "next/server"
import { compare } from "bcryptjs";
import { db } from "@/lib/db"
import { encrypt } from "@/lib/session"

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const token = await encrypt({ id: user.id, email: user.email });

    const res = NextResponse.json({ success: true, message: "Login successful" })
    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    })

    return res;
}
