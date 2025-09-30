'use client';

import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
    return (
        <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                </div>
                <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Enter your email to get started with Cashly
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center w-full">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}