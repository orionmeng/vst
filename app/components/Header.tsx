/**
 * Application Header Component
 * 
 * Displays navigation menu and authentication controls.
 * Active route is highlighted with animation effects.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

/**
 * Main header navigation component with authentication
 * Shows loading spinner during auth check, username when logged in
 */
export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Dynamic link styles based on active route
  const linkClass = (href: string) =>
    clsx(
      "relative transition-all duration-300 ease-out",
      pathname === href
        ? "text-white font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
        : "text-gray-400 hover:text-red-300",
      "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-red-500 after:w-full",
      pathname === href ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
    );

  return (
    <header className="bg-neutral-800 border-b border-neutral-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-extrabold text-white">
          Valorant Skin Tracker
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/skins" className={linkClass("/skins")}>Skins</Link>
          <Link href="/collection" className={linkClass("/collection")}>Collection</Link>
          <Link href="/wishlist" className={linkClass("/wishlist")}>Wishlist</Link>
          <Link href="/loadouts" className={linkClass("/loadouts")}>Loadouts</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
        </nav>

        {/* AUTH BUTTONS */}
        {status === "loading" ? (
          <Loader2 className="animate-spin text-gray-400" size={18} />
        ) : session ? (
          <div className="flex items-center gap-3 text-sm">
            <Link 
              href="/settings" 
              className="text-gray-300 hover:underline cursor-pointer hidden sm:inline"
            >
              {session.user?.name}
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signup"
              className="border border-red-500 text-red-400 hover:bg-red-600/20 px-3 py-1 rounded text-sm"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
