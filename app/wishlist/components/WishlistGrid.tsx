/**
 * Wishlist Grid Component
 * 
 * Infinite scrolling grid of user's wishlisted skins.
 * Uses useInfiniteSkinsGrid hook with /api/wishlist endpoint.
 */

"use client";

import SkinCard from "@/app/skins/components/SkinCard";
import { useInfiniteSkinsGrid } from "@/app/hooks/useInfiniteSkinsGrid";

/**
 * User wishlist grid with infinite scroll
 * Shows skins the user wants to buy
 */
export default function WishlistGrid() {
  const { skins, isLoading, observerTarget } = useInfiniteSkinsGrid({
    apiEndpoint: "/api/wishlist",
  });

  if (skins.length === 0 && !isLoading) {
    return <p className="text-gray-400">No skins in your wishlist.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {skins.map((skin) => (
          <SkinCard key={skin.id} skin={skin} />
        ))}
      </div>

      {/* Loading indicator / Observer target */}
      <div ref={observerTarget} className="py-8 text-center">
        {isLoading && <p className="text-gray-400">Loading skins...</p>}
      </div>
    </>
  );
}
