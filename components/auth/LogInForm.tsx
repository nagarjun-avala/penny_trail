"use client"

import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LockOpen, Mail, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginUserSchema } from "@/lib/schemas";
import { toast } from 'sonner';
import { loginUser } from '@/lib/controllers';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '../ui/label';
import Link from 'next/link';

const LogInForm = () => {
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
            email: '',
            password: ""
        }
    });

    const handleLogin = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            await loginUser(data); // uses postData internally
            toast.success("Logged in successfully!");
            router.push(callbackUrl); // or navigate where needed
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                toast.error("Login failed");
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Login</CardTitle>
                <p className="text-sm text-gray-600">Access your Expense Tracker dashboard</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                    <div className="flex flex-col gap-6">
                        {/* Email */}
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    {...register("email")}
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors?.email?.message}</p>}
                        </div>
                        {/* Password */}
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                {showPassword ? <LockOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> : <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder={showPassword ? "password" : "••••••••"}
                                    className="pl-10 pr-14"
                                    required
                                />
                                <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer">
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
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href={"/register"} className="underline underline-offset-4">Register</Link>
                    </div>
                </form>
            </CardContent>
        </Card >
    )
}

export default LogInForm