import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://roberto-ingenito.ddns.net:5001',
  },
  images: {
    domains: ['roberto-ingenito.ddns.net'],
  },
  output: "standalone"
}

export default nextConfig;


