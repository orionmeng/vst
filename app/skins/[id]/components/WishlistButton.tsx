"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  skinId: string;
  initialWishlisted: boolean;
  isAuthenticated: boolean;
}

export default function WishlistButton({
  skinId,
  initialWishlisted,
  isAuthenticated,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleWishlist() {
    if (!isAuthenticated || loading) return;

    const next = !wishlisted;
    setWishlisted(next);
    setLoading(true);

    try {
      await fetch(
        next ? "/api/wishlist/add" : "/api/wishlist/remove",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skinId }),
        }
      );
    } catch (err) {
      setWishlisted(!next);
      console.error(err);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={!isAuthenticated || loading}
      className={`px-4 py-2 rounded text-sm font-medium transition ${
        wishlisted
          ? "bg-purple-600 text-white hover:bg-purple-500"
          : "bg-neutral-800 text-purple-400 border border-purple-600 hover:bg-purple-600/10"
      } ${
        (!isAuthenticated || loading) && "opacity-50 cursor-not-allowed"
      }`}
    >
      {loading
        ? "Loading..."
        : wishlisted
        ? "In Wishlist"
        : isAuthenticated
        ? "Add to Wishlist"
        : "Sign In to Add"}
    </button>
  );
}
