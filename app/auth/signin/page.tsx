"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthInput from "@/app/components/AuthInput";

export default function SigninPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setResent(false);
    setLoading(true);

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email before signing in.");
        setInfo("Didn’t get the email?");
      } else if (res.error === "CredentialsSignin") {
        setError("Invalid email/username or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    window.location.href = "/";
  }

  async function resendVerification() {
    setInfo(null);
    setResent(false);

    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier }),
    });

    setResent(true);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-4 text-white">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-2">
            Email or Username
          </label>
          <AuthInput
            id="identifier"
            type="text"
            placeholder="Enter your email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <AuthInput
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Errors */}
        {error && <p className="pt-3 text-sm text-red-400">{error}</p>}

        {/* Info text */}
        {info && <p className="pt-1 text-sm text-yellow-400">{info}</p>}

        {/* Resend verification */}
        {error === "Please verify your email before signing in." && (
          <button
            type="button"
            onClick={resendVerification}
            className="text-sm text-red-400 hover:underline cursor-pointer"
          >
            Resend verification email
          </button>
        )}

        {resent && (
          <p className="text-sm text-green-400">
            Verification email sent. Check your inbox.
          </p>
        )}
      </form>

      <div className="pt-4 text-sm text-gray-300">
        No account?{" "}
        <Link href="/auth/signup" className="text-red-400 hover:underline">
          Create one
        </Link>
      </div>

      <div className="pt-2 text-sm text-gray-300">
        <Link href="/auth/forgot" className="text-red-400 hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
