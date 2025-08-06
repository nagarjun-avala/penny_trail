// app/api/category/[id]/route.ts

import { NextResponse } from "next/server";
import { insertCategorySchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/getServerSession";

export async function PATCH(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        // ⛏️ parse the incoming JSON
        const body = await request.json();

        // 🧪 Validate only the fields being sent (partial)
        const { name, icon, color, type } = insertCategorySchema.partial().parse(body);

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 🔄 Update the category
        const updated = await db.category.update({
            where: { id, userId: session?.id },
            data: { name, icon, color, type },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update category:", error);
        return new NextResponse("Failed to update category", { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 🔍 Check if there are transactions linked to this category
        const linkedTransactions = await db.transaction.findFirst({
            where: { categoryId: id },
        });

        if (linkedTransactions) {
            return new NextResponse("Category has associated transactions", {
                status: 400,
            });
        }

        // ✅ Safe to delete
        await db.category.delete({
            where: { id },
        });

        // 👀 Step 1: Confirm it exists
        const existing = await db.category.findUnique({
            where: { id },
        });

        if (!existing) {
            return new Response("Category not found", { status: 404 });
        }

        // ✅ Step 2: Delete it safely
        await db.category.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("❌ Failed to delete category:", error);
        return new NextResponse("Failed to delete category", { status: 500 });
    }
}