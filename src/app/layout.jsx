/** route: src/app/layout.jsx */
import "./globals.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { VehicleProvider } from "@/contexts/VehicleContext";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Script from "next/script";
import ConditionalLayout from "@/components/ConditionalLayout";

// Add the missing Inter font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://pnwcashforcars.com'),
  title: "PNW Cash For Cars - Instant Junk Car Quotes | Get Cash Today",
  description:
    "Get instant cash offers for your junk car. Free pickup and cash on the spot. Top dollar guaranteed. Sell your car in any condition - running or not.",
  keywords:
    "junk car buyer, cash for cars, sell junk car, car removal, instant quote, free pickup",
  authors: [{ name: "PNW Cash For Cars" }],
  creator: "PNW Cash For Cars",
  publisher: "PNW Cash For Cars",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pnwcashforcars.com",
    title: "PNW Cash For Cars - Instant Junk Car Quotes",
    description:
      "Get instant cash offers for your junk car. Free pickup and cash on the spot.",
    siteName: "PNW Cash For Cars",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PNW Cash For Cars - Instant Cash Offers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNW Cash For Cars - Instant Junk Car Quotes",
    description:
      "Get instant cash offers for your junk car. Free pickup and cash on the spot.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://pnwcashforcars.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          // href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* SEO and Social Media */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#2563eb" />
      </head>

      <body
        className={`${inter.className} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />

        <ErrorBoundary>
          <VehicleProvider>
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
            >
              Skip to main content
            </a>

            <ConditionalLayout>{children}</ConditionalLayout>

            {/* Toast notifications for user feedback */}
            <Toaster />

            {/* Accessibility announcements */}
            <div
              id="a11y-status-message"
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            ></div>
          </VehicleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
