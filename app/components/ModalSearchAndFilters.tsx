/**
 * Modal Search and Filter Controls
 * 
 * Search input and collection/wishlist filter toggles.
 * Used in skin selection modals for loadout editor.
 */

"use client";

interface ModalSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCollection: boolean;
  onToggleCollection: () => void;
  filterWishlist: boolean;
  onToggleWishlist: () => void;
}

/**
 * Search bar with collection/wishlist filter buttons
 */
export default function ModalSearchAndFilters({
  searchQuery,
  onSearchChange,
  filterCollection,
  onToggleCollection,
  filterWishlist,
  onToggleWishlist,
}: ModalSearchAndFiltersProps) {
  return (
    <>
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search skins..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
      />

      {/* FILTER BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={onToggleCollection}
          className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
            filterCollection
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-400 hover:text-white border border-neutral-700"
          }`}
        >
          In Collection
        </button>
        <button
          onClick={onToggleWishlist}
          className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
            filterWishlist
              ? "bg-purple-600 text-white"
              : "bg-neutral-800 text-gray-400 hover:text-white border border-neutral-700"
          }`}
        >
          In Wishlist
        </button>
      </div>
    </>
  );
}
