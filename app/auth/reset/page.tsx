"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthInput from "@/app/components/AuthInput";

export default function ResetPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token");

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <p className="text-red-400">Invalid or missing reset token.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (pw1 !== pw2) {
      setMessage("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: pw1 }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      setMessage("Error resetting password. Try again.");
      return;
    }

    setMessage("Password reset! Redirecting...");
    setTimeout(() => router.push("/auth/signin"), 1500);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-4 text-white">Set a new password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="password"
          placeholder="Enter new password"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
        />

        <AuthInput
          type="password"
          placeholder="Re-enter new password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-medium transition-colors cursor-pointer"
        >
          Reset password
        </button>
      </form>

      {message && (
        <p className="pt-4 text-sm text-gray-300">{message}</p>
      )}
    </div>
  );
}
