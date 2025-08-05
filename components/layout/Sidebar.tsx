"use client"
import { cn } from "@/lib/utils";
import CurrencySelector from "@/components/CurrencySelector";
import { usePathname } from "next/navigation"
import Link from "next/link";
import { navigation } from "@/lib/contsants";
import { createElement } from "react";

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white shadow-lg border-r border-slate-200 hidden lg:block">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                        <i className="fas fa-coins text-white text-lg"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Penny Trail</h1>
                        <p className="text-sm text-slate-500">Track Every Penny</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link key={item.name} href={item.href} className={cn(
                            "nav-link",
                            isActive && "active"
                        )}>
                            <div
                                className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                            >
                                {typeof item.icon === "string" ? item.icon : createElement(item.icon)}
                            </div>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-200 p-4">
                <div className="flex items-center justify-center">
                    <CurrencySelector />
                </div>
            </div>
        </aside>
    );
}
