// components/ui/GlobalLoader.tsx
"use client";

import { useLoading } from "@/context/LoadingContext";


export function GlobalLoader() {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-transparent border-gray-800" />
        </div>
    );
}
