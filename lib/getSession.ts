// lib/getServerSession.ts
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "./db";

export async function getServerSession() {
    const token = (await cookies()).get("token")?.value;
    return token ? decrypt(token) : null;
}

export async function getCurrentUser() {
    const session = await getServerSession();
    if (!session?.id) return null;

    const user = await db.user.findUnique({
        where: { id: session.id as string },
        omit: {
            password: true
        }
    });

    return user;
}
