import "@/styles/globals.css";
import { Viewport } from "next";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx("min-h-screen text-foreground bg-background font-sans antialiased relative flex flex-col h-screen", fontSans.variable)}>
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>
    </div>
  );
}
