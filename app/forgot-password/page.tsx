// app/forgot-password/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // handle forgot password logic
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending Reset Link..." : "Send Reset Link"}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <p className="text-sm text-center text-muted-foreground">
                            ✅ If an account with that email exists, a reset link has been sent.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
