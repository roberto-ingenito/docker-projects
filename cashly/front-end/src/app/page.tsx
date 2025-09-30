'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, PiggyBank, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const features = [
        {
            icon: <Wallet className="h-10 w-10 text-blue-500" />,
            title: 'Multiple Accounts',
            description: 'Manage multiple accounts and track balances separately',
        },
        {
            icon: <BarChart3 className="h-10 w-10 text-green-500" />,
            title: 'Visual Analytics',
            description: 'Beautiful charts and insights about your spending habits',
        },
        {
            icon: <PiggyBank className="h-10 w-10 text-purple-500" />,
            title: 'Budget Tracking',
            description: 'Set budgets and track your progress towards financial goals',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-16">
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                        <span className="text-2xl font-bold">Cashly</span>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="text-center mb-16 py-16">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Take Control of Your Finances
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Track expenses, manage budgets, and achieve your financial goals with Cashly - your personal finance companion
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="group">
                            Start Free Today
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center py-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Join thousands of users who are already managing their finances smarter
                    </p>
                    <Link href="/signup">
                        <Button size="lg" variant="secondary">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}