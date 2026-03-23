"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthInput from "@/app/components/AuthInput";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, username }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data?.error || "Error creating account.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful signup
    const signInRes = await signIn("credentials", {
      identifier: email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      setMessage("Account created! Please sign in.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-4 text-white">Create an account</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Display Name
          </label>
          <AuthInput
            id="name"
            type="text"
            placeholder="Enter your display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <AuthInput
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <AuthInput
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Create a password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {message && <p className="pt-3 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="pt-4 text-sm text-gray-300">
        Already registered?{" "}
        <Link href="/auth/signin" className="text-red-400 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
