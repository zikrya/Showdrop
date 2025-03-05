"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { href: "/campaigns", label: "Campaigns" },
    ...(isLoaded && user ? [{ href: "/admin", label: "Dashboard" }] : []),
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md border-b border-gray-100"
          : ""
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Snowflake className="h-6 w-6 text-blue-500" />
          </motion.div>
          <motion.span
            className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent"
            whileHover={{ letterSpacing: "0.02em" }}
            transition={{ duration: 0.3 }}
          >
            Showdrop
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group"
            >
              <motion.span
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-blue-500"
                    : "text-gray-600 group-hover:text-blue-500"
                }`}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
              </motion.span>
              {pathname === link.href ? (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                  layoutId="navbar-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 scale-x-0 origin-left"
                  initial={false}
                  animate={{ opacity: 0, scaleX: 0 }}
                  whileHover={{ opacity: 0.5, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}

          {/* Auth Buttons */}
          {isLoaded && user ? (
            <SignOutButton>
              <motion.button
                className="text-sm px-4 py-2 rounded-lg border border-red-100 text-red-500 hover:border-red-200 hover:text-red-600 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                Sign Out
              </motion.button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <motion.button
                className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                Sign In
              </motion.button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-500 hover:text-blue-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: isOpen ? 90 : -90 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden backdrop-blur-md border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3 px-4 py-5">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between text-sm font-medium py-2 ${
                      pathname === link.href
                        ? "text-blue-500"
                        : "text-gray-600 hover:text-blue-500"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                </motion.div>
              ))}

              {/* Auth Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                {isLoaded && user ? (
                  <SignOutButton>
                    <button className="text-sm w-full mt-2 px-4 py-2 rounded-lg border border-red-100 text-red-500 hover:border-red-200 hover:text-red-600 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                ) : (
                  <SignInButton>
                    <button className="text-sm w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}