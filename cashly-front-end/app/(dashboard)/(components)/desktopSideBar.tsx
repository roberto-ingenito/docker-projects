import { usePathname } from "next/navigation";
import { navigationItems, NavItem } from "./navItem";
import Link from "next/link";
import { ProfileDialog } from "./profileDialog";

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}

function NavigationItem({ item, isActive, onClick }: NavigationItemProps) {
  const Icon = item.icon;

  if (item.name.toLowerCase() === "profile") {
    return (
      <ProfileDialog>
        <div className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all text-slate-700 hover:bg-slate-100 hover:text-emerald-600 hover:scale-105 hover:cursor-pointer">
          <div className="flex items-center gap-x-3">
            <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {item.name}
          </div>
        </div>
      </ProfileDialog>
    );
  } else {
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`
        group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all
        ${
          isActive
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
            : "text-slate-700 hover:bg-slate-100 hover:text-emerald-600 hover:scale-105"
        }
      `}>
        <div className="flex items-center gap-x-3">
          <Icon className={`h-5 w-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
          {item.name}
        </div>
      </Link>
    );
  }
}

function Logo() {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Cashly</h1>
    </div>
  );
}

// Desktop Sidebar Component
export default function DesktopSidebar() {
  const pathname = usePathname();

  const isActiveRoute = (href: string): boolean => pathname.startsWith(href);

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex h-full flex-col bg-white border-r-1 border-r-slate-200">
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavigationItem item={item} isActive={isActiveRoute(item.href)} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
