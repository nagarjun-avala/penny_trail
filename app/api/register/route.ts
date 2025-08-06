import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const { email, password, name } = await req.json()

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await db.user.create({
        data: { email, password: hashed, name },
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
}
