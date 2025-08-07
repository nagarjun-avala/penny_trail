// app/api/transaction/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/getSession";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const categories = await db.category.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


// ✅ POST: Add a new category
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            name,
            icon, color, type
        } = body;

        // Quick validation (don’t trust the client!)
        if (!name || !icon || !type || !color) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const newCategory = await db.category.create({
            data: {
                name,
                icon, color, type,
                userId: session?.id,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("[CATEGORY_POST]", error);
        return new NextResponse("Failed to create category", { status: 500 });
    }
}

