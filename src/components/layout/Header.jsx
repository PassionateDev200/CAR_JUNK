/** route: src/components/layout/Header.jsx */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon,
  X,
  Phone,
  HelpCircle,
  Sparkles,
  FileQuestion,
  FileText,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  
  // Get authentication state from AuthContext
  const { user, isAuthenticated, logout } = useAuth();
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuAnchor(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    if (user.name) {
      const names = user.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

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
      href: "/manage",
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
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button variant="outline" size="sm">Join Now</Button>
            </div>
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
              {navItems.map((item) => (
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

            {/* Desktop CTA & Auth */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Admin Button */}
              <Link href="/admin/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  title="Admin Portal"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">Admin</span>
                </Button>
              </Link>

              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "#e5e7eb" }} />

              {/* User Profile Button with Dropdown */}
              {isAuthenticated ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#f3f4f6",
                    },
                  }}
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#0a66c2",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", lg: "block" } }}>
                    <Box
                      sx={{
                        fontSize: "0.813rem",
                        fontWeight: 600,
                        color: "#000000",
                        lineHeight: 1.2,
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user?.name || "User"}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "0.688rem",
                        color: "#666666",
                        lineHeight: 1.2,
                      }}
                    >
                      Account
                    </Box>
                  </Box>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </Box>
              ) : (
                <>
                  {/* Guest Buttons */}
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-all duration-200 px-4"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200 px-5"
                    >
                      Join Now
                    </Button>
                  </Link>
                </>
              )}

              {/* User Dropdown Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={() => setUserMenuAnchor(null)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 240,
                    borderRadius: 2,
                    border: "1px solid #e0dfdc",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.12)",
                    "& .MuiMenuItem-root": {
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.25,
                      fontSize: "0.938rem",
                      "&:hover": {
                        bgcolor: "#f3f2ef",
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #e0dfdc" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#0a66c2",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#000000",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.name || "User"}
                      </Box>
                      <Box
                        sx={{
                          fontSize: "0.813rem",
                          color: "#666666",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Menu Items */}
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    router.push("/manage");
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon sx={{ fontSize: 20, color: "#666666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Offers"
                    primaryTypographyProps={{
                      fontSize: "0.938rem",
                      fontWeight: 500,
                    }}
                  />
                </MenuItem>

                {/* <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    router.push("/account");
                  }}
                >
                  <ListItemIcon>
                    <ManageAccountsIcon sx={{ fontSize: 20, color: "#666666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Settings"
                    primaryTypographyProps={{
                      fontSize: "0.938rem",
                      fontWeight: 500,
                    }}
                  />
                </MenuItem> */}

                <Divider sx={{ my: 1, borderColor: "#e0dfdc" }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#dc2626 !important",
                    "&:hover": {
                      bgcolor: "#fef2f2 !important",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ fontSize: 20, color: "#dc2626" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sign Out"
                    primaryTypographyProps={{
                      fontSize: "0.938rem",
                      fontWeight: 600,
                    }}
                  />
                </MenuItem>
              </Menu>
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
                <MenuIcon className="w-6 h-6" />
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
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative top-16 mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="py-6 px-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
                {/* User Profile Section (Mobile) */}
                {isAuthenticated && (
                  <Box
                    sx={{
                      mb: 3,
                      pb: 3,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        bgcolor: "#f3f2ef",
                        borderRadius: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#0a66c2",
                          fontSize: "1.125rem",
                          fontWeight: 600,
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            fontSize: "1.063rem",
                            fontWeight: 600,
                            color: "#000000",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user?.name || "User"}
                        </Box>
                        <Box
                          sx={{
                            fontSize: "0.875rem",
                            color: "#666666",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user?.email}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Navigation Items */}
                {navItems.map((item) => (
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

                {/* Admin Button (Mobile) */}
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center p-4 rounded-2xl text-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300 border-t border-gray-200 mt-4 pt-6"
                >
                  <Shield className="w-5 h-5" />
                  <span className="ml-3">Admin Portal</span>
                </Link>

                {/* Auth Buttons (Mobile) */}
                {isAuthenticated ? (
                  <div className="border-t border-gray-200 mt-4 pt-6 space-y-3">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full py-3 text-lg font-medium"
                      >
                        <ManageAccountsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                        Account Settings
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full py-3 text-lg font-medium border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 mt-4 pt-6 space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full py-3 text-lg font-medium border-gray-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full py-3 text-lg font-medium border-2 border-blue-600 text-blue-600"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
