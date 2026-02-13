/**
 * NextAuth Type Extensions
 * 
 * Extends NextAuth types to include user ID in session and JWT.
 * Required for accessing user.id in getServerSession.
 */

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
