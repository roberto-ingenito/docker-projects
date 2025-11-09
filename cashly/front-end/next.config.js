/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,

    // Base path per tutte le route
    basePath: '/cashly',

    // Asset prefix per file statici
    assetPrefix: '/cashly',

    experimental: {},

    // Configurazione immagini
    images: {
        path: '/cashly/_next/image',
    },
};

export default nextConfig;
