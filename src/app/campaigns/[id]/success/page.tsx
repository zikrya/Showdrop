"use client";

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) {
      redirect("/");
    }

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [code]);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return null; // No use but to make TS happy
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-blue-50/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 p-6 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="rounded-full bg-green-100 p-3"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
          </div>

          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
            <p className="text-gray-600 mb-6">
              Your discount code has been generated and is ready to use.
            </p>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Your discount code:</p>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 font-mono text-xl font-semibold text-gray-800 tracking-wide">
                  {code}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/80 hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-green-500 text-xs font-medium"
                    >
                      Copied!
                    </motion.span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use this code at checkout to claim your discount. This code is unique to you and can only be used once.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50" asChild>
                  <Link href="/campaigns">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Campaigns
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
