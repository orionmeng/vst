/**
 * NextAuth Session Provider Wrapper
 * 
 * Client component that wraps the app to provide authentication context.
 * Must be used at the root layout level.
 */

"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wraps children with NextAuth SessionProvider
 * Enables useSession hook throughout the app
 */
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
