/**
 * NextAuth Route Handlers
 * 
 * API routes for NextAuth authentication.
 * Configuration is located in @/lib/auth
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
