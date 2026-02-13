"use client";

import { useState } from "react";
import Link from "next/link";
import AuthInput from "@/app/components/AuthInput";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    await fetch("/api/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    setMessage(
      "If an account exists for this email, a password reset link has been sent."
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-4 text-white">Reset your password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-medium transition-colors cursor-pointer"
        >
          Send reset link
        </button>
      </form>

      {message && (
        <p className="pt-4 text-sm text-gray-300">{message}</p>
      )}

      <div className="pt-6 text-sm text-gray-400">
        <Link href="/auth/signin" className="text-red-400 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
