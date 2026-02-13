"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CollectionButtonProps {
  skinId: string;
  initialCollected: boolean;
  isAuthenticated: boolean;
}

export default function CollectionButton({
  skinId,
  initialCollected,
  isAuthenticated,
}: CollectionButtonProps) {
  const [collected, setCollected] = useState(initialCollected);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleCollection() {
    if (!isAuthenticated || loading) return;

    setLoading(true);
    setCollected((prev: boolean) => !prev);

    try {
      await fetch(
        collected
          ? "/api/collection/remove"
          : "/api/collection/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skinId }),
        }
      );
    } catch (err) {
      setCollected((prev: boolean) => !prev);
      console.error(err);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleCollection}
      disabled={!isAuthenticated || loading}
      className={`px-4 py-2 rounded text-sm font-medium transition ${
        collected
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-neutral-800 text-blue-400 border border-blue-600 hover:bg-blue-600/10"
      } ${
        (!isAuthenticated || loading) && "opacity-50 cursor-not-allowed"
      }`}
    >
      {loading
        ? "Loading..."
        : collected
        ? "In Collection"
        : isAuthenticated
        ? "Add to Collection"
        : "Sign In to Add"}
    </button>
  );
}
