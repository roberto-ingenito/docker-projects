export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cashly",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Categories", href: "/categories" },
    { label: "Transactions", href: "/transactions" },
  ],
};
