import { LucideIcon, LayoutDashboard, Wallet, ArrowUpDown, Tag, User } from "lucide-react";

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export const navigationItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", href: "/accounts", icon: Wallet },
    { name: "Transactions", href: "/transactions", icon: ArrowUpDown },
    { name: "Categories", href: "/categories", icon: Tag },
    { name: "Profile", href: "/profile", icon: User },
];
