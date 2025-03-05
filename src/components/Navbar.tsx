"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-blue-600">
          Showdrop
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/campaigns"
            className={`text-gray-700 hover:text-blue-600 ${
              pathname === "/campaigns" ? "font-bold" : ""
            }`}
          >
            Campaigns
          </Link>

          {isLoaded && user ? (
            <>
              <Link
                href="/admin"
                className={`text-gray-700 hover:text-blue-600 ${
                  pathname === "/admin" ? "font-bold" : ""
                }`}
              >
                Dashboard
              </Link>
              <SignOutButton>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Sign Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
