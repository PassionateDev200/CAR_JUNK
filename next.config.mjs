/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from specific IPs (for development)
  allowedDevOrigins: [
    'http://107.172.232.77',
    'http://localhost',
  ],
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ]
  },
  // i18n: {
  //   locales: ["en", "pl"],
  //   defaultLocale: "en",
  // },
  env: {
    MARKETCHECK_API_KEY: process.env.MARKETCHECK_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Reduce memory usage during builds
  experimental: {
    // Reduce memory footprint
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
