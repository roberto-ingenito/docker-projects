'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard,
    Wallet,
    ArrowUpDown,
    Tags,
    PieChart
} from 'lucide-react';

export function MobileNav() {
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Accounts',
            href: '/accounts',
            icon: Wallet,
        },
        {
            name: 'Transactions',
            href: '/transactions',
            icon: ArrowUpDown,
        },
        {
            name: 'Categories',
            href: '/categories',
            icon: Tags,
        },
        {
            name: 'Analytics',
            href: '/analytics',
            icon: PieChart,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-background lg:hidden">
            <div className="flex w-full items-center justify-around">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center p-2 text-xs transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}