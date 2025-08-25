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
  }
};

export default nextConfig;
