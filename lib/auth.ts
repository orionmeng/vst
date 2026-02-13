/**
 * NextAuth Configuration
 * 
 * Configures authentication using NextAuth with:
 * - Credentials provider (email/username + password)
 * - Email provider for magic link authentication
 * - JWT session strategy
 * - Email verification enforcement
 */

import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NextAuth configuration options
 * Defines authentication providers, session strategy, and callbacks
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Validates user credentials and returns user object if valid
       * Enforces email verification before allowing login
       */
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            },
          });

          if (!user || !user.password) {
            console.log("User not found or no password set");
            return null;
          }

          console.log("Attempting auth for user:", user.id);
          console.log("Stored hash starts with:", user.password.substring(0, 20));

          if (!user.emailVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password valid:", isValid);

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),

    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT callback - adds user ID and name to JWT token
     * Fetches fresh user data when session is updated
     */
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      
      // Fetch fresh user data when session is updated
      if (trigger === "update" && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, username: true },
        });
        
        if (freshUser) {
          token.name = freshUser.name ?? freshUser.username;
        }
      }
      
      return token;
    },

    /**
     * Session callback - adds user ID and name to session object from JWT token
     */
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.name) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
