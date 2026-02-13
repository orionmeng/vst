/**
 * Skins Grid Component
 * 
 * Infinite scrolling grid of all skins.
 * Uses useInfiniteSkinsGrid hook for pagination.
 */

"use client";

import SkinCard from "./SkinCard";
import { useInfiniteSkinsGrid } from "@/app/hooks/useInfiniteSkinsGrid";

/**
 * Main skins grid with infinite scroll
 * Displays all skins from the catalog
 */
export default function SkinsGrid() {
  const { skins, isLoading, observerTarget } = useInfiniteSkinsGrid({
    apiEndpoint: "/api/skins",
  });

  if (skins.length === 0 && !isLoading) {
    return <p className="text-gray-400">No skins found.</p>;
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
