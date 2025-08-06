// lib/getServerSession.ts
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export async function getServerSession() {
    const token = (await cookies()).get("token")?.value;
    return token ? decrypt(token) : null;
}
