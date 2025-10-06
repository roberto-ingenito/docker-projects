"use client";

import React from "react";
import MobileBottomNav from "./(components)/mobileBottomNav";
import DesktopSidebar from "./(components)/desktopSideBar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Main content */}
      <main className="h-full overflow-y-auto lg:ml-72">
        <div className="px-4 py-8 pb-24 sm:px-6 lg:px-8 lg:py-10 lg:pb-10">{children}</div>
      </main>
    </div>
  );
}
