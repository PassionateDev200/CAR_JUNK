/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
    ],
  },
  // i18n: {
  //   locales: ["en", "pl"],
  //   defaultLocale: "en",
  // },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  env: {
    MARKETCHECK_API_KEY: process.env.MARKETCHECK_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
