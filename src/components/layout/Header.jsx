/** route: src/components/layout/Header.jsx */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  Car,
  Phone,
  HelpCircle,
  Sparkles,
  FileQuestion,
  FileText,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Replace the getAdminLoginUrl function with this simpler version:
  const getAdminLoginUrl = () => {
    return "/admin/login"; // Remove callback URL logic for now
  };

  const navItems = [
    {
      href: "/quote",
      label: "Get Quote",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      href: "/how-it-works",
      label: "How It Works",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      href: "/offer",
      label: "My Offers",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/faqs",
      label: "FAQs",
      icon: <FileQuestion className="w-4 h-4" />,
    },
    { href: "/contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
  ];

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl"></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PNW Cash For Cars
                </span>
                <span className="text-xs text-gray-500">
                  Top dollar guaranteed
                </span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, i) => (
                <div key={i} className="px-4 py-2 rounded-xl text-gray-600">
                  {item.label}
                </div>
              ))}
            </nav>
            <Button className="hidden md:flex bg-gradient-to-r from-orange-400 to-orange-500">
              Get Started
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
            : "bg-white/90 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-15 h-15 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Image
                    src="/logo.webp"
                    alt="PNW Cash For Cars Logo"
                    width={48}
                    height={48}
                    priority
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PNW{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    Cash For Cars
                  </span>
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Top dollar guaranteed
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-xl -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button with Callback */}
              <Link href={getAdminLoginUrl()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  title="Admin Login"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
              </Link>

              {/* Main CTA Button */}
              <Link href="/quote">
                <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 hover:bg-gray-100 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative top-16 mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="py-6 px-4 space-y-2">
                {navItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center p-4 rounded-2xl text-lg font-medium transition-all duration-300",
                      pathname === item.href
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Admin Button with Callback */}
                <Link
                  href={getAdminLoginUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center p-4 rounded-2xl text-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300 border-t border-gray-200 mt-4 pt-6"
                >
                  <Shield className="w-5 h-5" />
                  <span className="ml-3">Admin Login</span>
                </Link>

                {/* Mobile Main CTA */}
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full mt-6"
                >
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
