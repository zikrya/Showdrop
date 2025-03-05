"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Gift, Users, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[calc(100vh-80px)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="w-full max-w-4xl text-center space-y-6 pt-16 sm:pt-24 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative Elements */}
        <div className="absolute -top-10 left-0 w-full h-40 flex justify-between items-start opacity-30 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="text-blue-500 text-4xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: [0, 1, 0],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: i * 0.5,
                  ease: "easeInOut",
                },
              }}
              style={{
                x: `${i * 20}%`,
                filter: "blur(0.5px)",
              }}
            >
              ❄
            </motion.div>
          ))}
        </div>

        <motion.div
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4 shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Easily create and manage discount campaigns
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Drop discounts like{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              snow
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-100 rounded-full -z-10"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </span>
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Create campaigns, generate discount codes, and let customers sign up to receive them.
          <span className="block mt-2">Simple, effective, and hassle-free.</span>
        </p>

        <motion.div
          className={`mt-10 flex flex-col sm:flex-row gap-4 ${
            isSignedIn ? "justify-center" : "justify-center sm:justify-center"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/sign-up">
            <motion.button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium flex items-center justify-center hover:from-blue-500 hover:to-blue-600 shadow-sm hover:shadow transition-all w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>
          </Link>

          {isSignedIn && (
            <Link href="/admin">
              <motion.button
                className="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow w-full sm:w-auto"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Dashboard
              </motion.button>
            </Link>
          )}
        </motion.div>
      </motion.section>

      <motion.section
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div className="flex items-start" whileHover={{ x: 5 }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-500">
                  <Gift className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Create Campaigns</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Set up discount campaigns with custom rules, expiration dates, and unique codes.
                </p>
              </div>
            </motion.div>

            <motion.div className="flex items-start" whileHover={{ x: 5 }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-500">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Customer Sign-ups</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Customers sign up to receive your discount codes through a simple form.
                </p>
              </div>
            </motion.div>

            <motion.div className="flex items-start" whileHover={{ x: 5 }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-500">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Instant Delivery</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Codes are delivered instantly to customers via email or text message.
                </p>
              </div>
            </motion.div>
          </motion.div>


          <motion.div
            className="bg-blue-50/50 p-8 rounded-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Why Showdrop?</h3>
            <ul className="space-y-6">
              {[
                "Simple campaign management",
                "Automated discount code distribution",
                "Customer analytics and insights",
                "Easy integration with your existing systems",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 pt-6 border-t border-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="text-sm text-blue-600 font-medium">
                Join hundreds of businesses already using Showdrop
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-12"
            whileHover={{ y: -2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for some discount?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse through businesses that use Showdrop to create effective discount campaigns and boost customer engagement.
            </p>
            <Link href="/campaigns">
              <motion.button
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium inline-flex items-center justify-center hover:from-blue-500 hover:to-blue-600 shadow-sm hover:shadow transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Click Here
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}