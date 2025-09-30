'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    return (
        <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                </div>
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center w-full">
                    {`Don't have an account?`}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}