"use client";

import { Navbar as HeroUINavbar, NavbarContent, NavbarMenu, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import * as authSlice from "@/lib/redux/slices/authSlice";
import * as categoriesSlice from "@/lib/redux/slices/categoriesSlice";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const dispatch = useAppDispatch();

  async function logout() {
    await dispatch(authSlice.logout());
    dispatch(categoriesSlice.clear());

    router.replace("/login");
  }

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" isBordered>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
        <NavbarBrand>
          <p className="font-bold text-inherit">Cashly</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {siteConfig.navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={`${item.label}-${index}`} isActive={isActive}>
              <Link
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                className={`
                  transition-all duration-150
                  ${
                    isActive
                      ? "font-semibold border-b-2 border-primary pb-1"
                      : "hover:text-primary hover:border-b-2 hover:border-primary/30 hover:pb-1"
                  }
                `}>
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitch />
        <ArrowRightStartOnRectangleIcon
          strokeWidth={2}
          className="size-6 transition-opacity hover:opacity-80 cursor-pointer text-default-500!"
          onClick={logout}
        />
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                aria-current={isActive ? "page" : undefined}
                href={item.href}
                color={isActive ? "primary" : "foreground"}
                className={`
                  w-full px-4 py-3 rounded-xl transition-all duration-300 
                  ${isActive ? "font-semibold bg-primary/20 text-primary scale-105" : "hover:bg-default-100/80"}
                `}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
