/**
 * Collection Grid Component
 * 
 * Infinite scrolling grid of user's collected skins.
 * Uses useInfiniteSkinsGrid hook with /api/collection endpoint.
 */

"use client";

import SkinCard from "@/app/skins/components/SkinCard";
import { useInfiniteSkinsGrid } from "@/app/hooks/useInfiniteSkinsGrid";

/**
 * User collection grid with infinite scroll
 * Shows skins the user owns
 */
export default function CollectionGrid() {
  const { skins, isLoading, observerTarget } = useInfiniteSkinsGrid({
    apiEndpoint: "/api/collection",
  });

  if (skins.length === 0 && !isLoading) {
    return <p className="text-gray-400">No skins in your collection.</p>;
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
