"use client"
import React, { createElement, useState } from "react";
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CurrencySelector from "@/components/CurrencySelector";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navigation } from "@/lib/contsants";

export default function MobileHeader() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false);

    return (
        <header className="lg:hidden bg-white shadow-sm border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                        <i className="fas fa-coins text-white text-sm"></i>
                    </div>
                    <h1 className="text-lg font-bold text-slate-900">Penny Trail</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <CurrencySelector />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 rounded-lg hover:bg-slate-100">
                                <Menu className="text-slate-600" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-3">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                                    <i className="fas fa-coins text-white text-sm"></i>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">Penny Trail</h1>
                                    <p className="text-sm text-slate-500">Track Every Penny</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                                    return (
                                        <Link key={item.name} href={item.href} className={cn(
                                            "nav-link",
                                            isActive && "active"
                                        )}
                                            onClick={() => setOpen(false)}>
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
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
