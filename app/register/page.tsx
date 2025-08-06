"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockOpen, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterInput, registerUserSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerUserSchema),
    });

    const handleRegister = async (registerData: RegisterInput) => {
        setIsLoading(true);
        console.log("Register Data", registerData);
        // TODO: API call
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">Register</CardTitle>
                    <p className="text-sm text-gray-600">Access your budget dashboard</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    {...register("name")}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                {showPassword ? <LockOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> : <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={showPassword ? "password" : "••••••••"}
                                    className="pl-10 pr-14"
                                    required
                                />
                                <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer">
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
