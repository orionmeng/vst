/**
 * Skin Action Buttons Component
 * 
 * Manages collection and wishlist toggle buttons for a skin.
 * Enforces mutual exclusivity - skin can't be in both lists.
 * Handles optimistic updates and error rollback.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SkinActionsProps {
  skinId: string;
  initialWishlisted: boolean;
  initialCollected: boolean;
  isAuthenticated: boolean;
}

/**
 * Renders collection and wishlist action buttons
 * Prevents concurrent operations with loading state
 * Reverts state on API error
 */
export default function SkinActions({
  skinId,
  initialWishlisted,
  initialCollected,
  isAuthenticated,
}: SkinActionsProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [collected, setCollected] = useState(initialCollected);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Toggles wishlist status for this skin
   * Automatically removes from collection if adding to wishlist
   */
  async function toggleWishlist() {
    if (!isAuthenticated || loading) return;

    const next = !wishlisted;
    // Optimistic update
    setWishlisted(next);
    if (next && collected) {
      setCollected(false); // Enforce mutual exclusivity
    }
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
      if (next && collected) {
        setCollected(true); // Revert collection state on error
      }
      console.error(err);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  /**
   * Toggles collection status for this skin
   * Automatically removes from wishlist if adding to collection
   */
  async function toggleCollection() {
    if (!isAuthenticated || loading) return;

    const next = !collected;
    // Optimistic update
    setCollected(next);
    if (next && wishlisted) {
      setWishlisted(false); // Enforce mutual exclusivity
    }
    setLoading(true);

    try {
      await fetch(
        next ? "/api/collection/add" : "/api/collection/remove",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skinId }),
        }
      );
    } catch (err) {
      setCollected(!next);
      if (next && wishlisted) {
        setWishlisted(true); // Revert wishlist state on error
      }
      console.error(err);
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <button
        onClick={toggleCollection}
        disabled={!isAuthenticated || loading}
        className={`px-4 py-2 rounded text-sm font-medium transition border ${
          collected
            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
            : "bg-neutral-800 text-blue-400 border-blue-600 hover:bg-blue-600/10"
        } ${
          (!isAuthenticated || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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

      <button
        onClick={toggleWishlist}
        disabled={!isAuthenticated || loading}
        className={`px-4 py-2 rounded text-sm font-medium transition border ${
          wishlisted
            ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-500"
            : "bg-neutral-800 text-purple-400 border-purple-600 hover:bg-purple-600/10"
        } ${
          (!isAuthenticated || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
    </div>
  );
}
