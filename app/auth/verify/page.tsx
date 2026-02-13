"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      {status === "loading" && (
        <p className="text-gray-300">Verifying your email…</p>
      )}

      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">
            Email verified
          </h1>
          <p className="text-gray-400 mb-4">
            Your account is now active.
          </p>
          <Link
            href="/auth/signin"
            className="text-red-400 hover:underline"
          >
            Back to sign in
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">
            Verification failed
          </h1>
          <p className="text-gray-400 mb-4">
            This link may be invalid or expired.
          </p>
          <Link
            href="/auth/signin"
            className="text-red-400 hover:underline"
          >
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}
