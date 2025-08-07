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

        const transactions = await db.transaction.findMany({
            where: {
                userId: session?.id
            },
            include: {
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(transactions);
    } catch (error) {
        console.error("[TRANSACTIONS_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


// ✅ POST: Add a new transaction
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            description,
            amount,
            type,
            note,
            categoryId,
        } = body;

        // Quick validation (don’t trust the client!)
        if (!description || !amount || !type || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const newTransaction = await db.transaction.create({
            data: {
                description,
                amount,
                type,
                note,
                categoryId,
                userId: session?.id,
            },
        });

        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error("[TRANSACTIONS_POST]", error);
        return new NextResponse("Failed to create transaction", { status: 500 });
    }
}
