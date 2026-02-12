import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { PwaRegister } from "@/lib/pwa_register";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/cashly/favicon.ico",
  },
  manifest: "/cashly/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const myVariableFont = localFont({
  src: [
    {
      path: "../public/fonts/EBGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
    {
      path: "../public/fonts/EBGaramond-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-custom", // La variabile per Tailwind
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={myVariableFont.variable}>
      <head />
      <body suppressHydrationWarning>
        <PwaRegister />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>{children}</Providers>
      </body>
    </html>
  );
}
