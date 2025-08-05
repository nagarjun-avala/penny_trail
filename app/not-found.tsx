"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600">
                <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
                <p className="mt-2 text-slate-600 max-w-md">
                    Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                </p>
            </div>

            <Link href="/">
                <Button>← Back to Home</Button>
            </Link>
        </div>
    );
}
