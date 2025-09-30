'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard,
    Wallet,
    ArrowUpDown,
    Tags,
    PieChart,
    Settings,
    HelpCircle
} from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
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

    const secondaryNavigation = [
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
        },
        {
            name: 'Help',
            href: '/help',
            icon: HelpCircle,
        },
    ];

    return (
        <aside className={cn('w-64 border-r bg-card', className)}>
            <div className="flex h-full flex-col">
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <nav className="space-y-1 border-t px-3 py-4">
                    {secondaryNavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}