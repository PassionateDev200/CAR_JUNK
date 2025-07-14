/** route: src/components/layout/Footer.jsx */
"use client";
/**
 * src/components/layout/Footer.jsx
 */
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const quickLinks = [
    { href: "/quote", label: "Get Quote" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  const supportLinks = [
    { href: "/faqs", label: "FAQ" },
    { href: "#", label: "About Us" },
    { href: "#", label: "Customer Support" },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <Image
                    src="/logo.webp"
                    alt="PNW Cash For Cars Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                    PNW Cash For Cars
                  </h3>
                  <p className="text-sm text-gray-400">Top dollar guaranteed</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Get instant cash offers for your junk car with free pickup
                service. We provide the best prices in the Pacific Northwest.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                Contact Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-blue-400" />
                  <span>1-971-398-7852</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-purple-400" />
                  <span>support@pnwcashforcars.com</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5 text-green-400" />
                  <span>Serving all of Pacific Northwest</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 PNW Cash For Cars. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">
                  Made with ❤️ in the PNW
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
