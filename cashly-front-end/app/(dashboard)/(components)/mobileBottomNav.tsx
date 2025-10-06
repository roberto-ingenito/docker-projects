import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems, NavItem } from "./navItem";
import { ProfileDialog } from "./profileDialog";

// Mobile Bottom Nav Item Component
function BottomNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  if (item.name.toLowerCase() === "profile") {
    return (
      <ProfileDialog>
        <div className="flex flex-col items-center justify-center flex-1 h-full w-full px-2 mx-1 transition-all hover:cursor-pointer">
          <div className="w-full flex flex-col items-center gap-1 transition-all scale-100">
            <div className="p-2 rounded-xl transition-all bg-transparent">
              <Icon className="h-5 w-5 text-slate-600" />
            </div>
            <span className="text-xs font-medium transition-all text-slate-600">{item.name}</span>
          </div>
        </div>
      </ProfileDialog>
    );
  } else {
    return (
      <Link href={item.href} className="flex flex-col items-center justify-center flex-1 h-full w-full px-2 mx-1 transition-all">
        <div className={`w-full flex flex-col items-center gap-1 transition-all ${isActive ? "scale-110" : "scale-100"}`}>
          <div
            className={`p-2 rounded-xl transition-all
          ${
            isActive //
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
              : "bg-transparent"
          }`}>
            <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-600"}`} />
          </div>
          <span
            className={`text-xs font-medium transition-all
          ${
            isActive //
              ? "text-emerald-600 font-semibold"
              : "text-slate-600"
          }
        `}>
            {item.name}
          </span>
        </div>
      </Link>
    );
  }
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActiveRoute = (href: string): boolean => pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="flex items-center justify-around h-18 px-2">
        {navigationItems.map((item) => (
          <BottomNavItem key={item.name} item={item} isActive={isActiveRoute(item.href)} />
        ))}
      </div>
    </nav>
  );
}
