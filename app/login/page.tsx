"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockOpen, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginUserSchema } from "@/lib/schemas";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: 'demo@example.com',
            password: "User@12345"
        }
    });

    const handleLogin = async (loginData: LoginInput) => {
        setIsLoading(true);
        console.log(JSON.stringify(loginData))
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            })
            if (!res.ok) {
                const text = await res.text();
                console.error("Unexpected response:", text);
                throw new Error("Failed to fetch budget data");
            }

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed")

            toast.success("Logged in successfully")
            router.push(callbackUrl)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Unknown error", err);
            }
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">Login</CardTitle>
                    <p className="text-sm text-gray-600">Access your Expense Tracker dashboard</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    {...register("email")}
                                    placeholder="you@example.com"
                                    className="pl-10"
                                />
                                {errors.email && <p className="text-sm text-destructive mt-1">{errors?.email?.message}</p>}

                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                {showPassword ? <LockOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> : <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder={showPassword ? "password" : "••••••••"}
                                    className="pl-10 pr-14"
                                />
                                <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer shadow-none">
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive mt-1">{errors?.password?.message}</p>}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
