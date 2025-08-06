// app/providers/RouteChangeHandler.tsx
"use client";

import { useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { usePathname } from "next/navigation";

export function RouteChangeHandler() {
    const pathname = usePathname();
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 400); // adjustable delay
        return () => clearTimeout(timeout);
    }, [pathname, setLoading]);

    return null;
}
