
import LogInForm from "@/components/auth/LogInForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function LoginPage() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">Login</CardTitle>
                    <p className="text-sm text-gray-600">Access your Expense Tracker dashboard</p>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <LogInForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
