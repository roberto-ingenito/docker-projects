import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        layout: {
          disabledOpacity: 0.4
        },
        "colors": {
          "default": {
            "50": "#f5f3f1",
            "100": "#e8e3df",
            "200": "#d1c7bd",
            "300": "#baab9b",
            "400": "#a38f79",
            "500": "#9a8374",
            "600": "#7d6a5e",
            "700": "#605147",
            "800": "#433831",
            "900": "#261f1a",
            "foreground": "#fff",
            "DEFAULT": "#9a8374"
          },
          "primary": {
            "50": "#f2eeeb",
            "100": "#e0d5cd",
            "200": "#cdbcaf",
            "300": "#baa391",
            "400": "#a78a73",
            "500": "#947155",
            "600": "#795d46",
            "700": "#5e4937",
            "800": "#433528",
            "900": "#282119",
            "foreground": "#fff",
            "DEFAULT": "#947155"
          },
          "secondary": {
            "50": "#eef2f1",
            "100": "#d5e0dd",
            "200": "#abc1ba",
            "300": "#81a297",
            "400": "#578374",
            "500": "#4a7063",
            "600": "#3c5a50",
            "700": "#2f453e",
            "800": "#21302b",
            "900": "#141b19",
            "foreground": "#fff",
            "DEFAULT": "#4a7063"
          },
          "success": {
            "50": "#e8f5e9",
            "100": "#c5e7c7",
            "200": "#a1d9a5",
            "300": "#7dcb83",
            "400": "#59bd61",
            "500": "#4caf50",
            "600": "#3d8c41",
            "700": "#2e6932",
            "800": "#1f4623",
            "900": "#102314",
            "foreground": "#fff",
            "DEFAULT": "#4caf50"
          },
          "warning": {
            "50": "#fff8e8",
            "100": "#ffeec5",
            "200": "#ffe3a1",
            "300": "#ffd97d",
            "400": "#ffce59",
            "500": "#ffc435",
            "600": "#d2a02b",
            "700": "#a67c21",
            "800": "#795817",
            "900": "#4d340e",
            "foreground": "#000",
            "DEFAULT": "#ffc435"
          },
          "danger": {
            "50": "#feeae9",
            "100": "#fcc9c6",
            "200": "#faa8a3",
            "300": "#f88780",
            "400": "#f6665d",
            "500": "#f4453a",
            "600": "#c93830",
            "700": "#9e2b26",
            "800": "#731e1c",
            "900": "#481112",
            "foreground": "#fff",
            "DEFAULT": "#f4453a"
          },
          "background": "#faf8f6",
          "foreground": "#5a4a3e",
          "content1": {
            "DEFAULT": "#f5f1ed",
            "foreground": "#000"
          },
          "content2": {
            "DEFAULT": "#ede7e1",
            "foreground": "#000"
          },
          "content3": {
            "DEFAULT": "#e5ddd5",
            "foreground": "#000"
          },
          "content4": {
            "DEFAULT": "#ddd3c9",
            "foreground": "#000"
          },
          "focus": "#947155",
          "overlay": "#000000"
        }
      },
      dark: {
        layout: {
          disabledOpacity: 0.4
        },
        "colors": {
          "default": {
            "50": "#1a1512",
            "100": "#2d231c",
            "200": "#403227",
            "300": "#534031",
            "400": "#664f3c",
            "500": "#9a8374",
            "600": "#b09d8f",
            "700": "#c5b7aa",
            "800": "#dbd1c5",
            "900": "#f0ebe0",
            "foreground": "#fff",
            "DEFAULT": "#664f3c"
          },
          "primary": {
            "50": "#281f17",
            "100": "#3f3225",
            "200": "#574533",
            "300": "#6e5841",
            "400": "#866b4f",
            "500": "#a18667",
            "600": "#b39f7f",
            "700": "#c5b997",
            "800": "#d7d2af",
            "900": "#e9ecc7",
            "foreground": "#000",
            "DEFAULT": "#a18667"
          },
          "secondary": {
            "50": "#141c1a",
            "100": "#212f2b",
            "200": "#2e433d",
            "300": "#3b564e",
            "400": "#486a60",
            "500": "#5f8a7d",
            "600": "#7aa095",
            "700": "#96b6ad",
            "800": "#b1ccc5",
            "900": "#cde2dd",
            "foreground": "#000",
            "DEFAULT": "#5f8a7d"
          },
          "success": {
            "50": "#0d2613",
            "100": "#15421f",
            "200": "#1e5e2c",
            "300": "#267a38",
            "400": "#2f9645",
            "500": "#4daf5f",
            "600": "#6fc07d",
            "800": "#b4deba",
            "900": "#d6efd8",
            "foreground": "#000",
            "DEFAULT": "#4daf5f"
          },
          "warning": {
            "50": "#4d3810",
            "100": "#795819",
            "200": "#a67823",
            "300": "#d2982c",
            "400": "#ffb836",
            "500": "#ffc557",
            "600": "#ffd178",
            "700": "#ffdd99",
            "800": "#ffe9ba",
            "900": "#fff5db",
            "foreground": "#000",
            "DEFAULT": "#ffb836"
          },
          "danger": {
            "50": "#481114",
            "100": "#731c1f",
            "200": "#9e282a",
            "300": "#c93335",
            "400": "#f43f40",
            "500": "#f6605f",
            "600": "#f8817e",
            "700": "#faa29d",
            "800": "#fcc3bc",
            "900": "#fee4db",
            "foreground": "#000",
            "DEFAULT": "#f6605f"
          },
          "background": "#1c1410",
          "foreground": "#d9cdc0",
          "content1": {
            "DEFAULT": "#2d241d",
            "foreground": "#fff"
          },
          "content2": {
            "DEFAULT": "#3e3229",
            "foreground": "#fff"
          },
          "content3": {
            "DEFAULT": "#4f4036",
            "foreground": "#fff"
          },
          "content4": {
            "DEFAULT": "#604e42",
            "foreground": "#fff"
          },
          "focus": "#a18667",
          "overlay": "#ffffff"
        }
      },
    }
  })],
}

module.exports = config;