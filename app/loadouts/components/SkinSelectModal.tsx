/**
 * Skin Selection Modal Component
 * 
 * Full-screen modal for selecting skins in loadout editor.
 * Features infinite scroll, search, weapon filter, and collection/wishlist filters.
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { WEAPONS, ITEMS_PER_PAGE, SkinWithFlags } from "@/lib/constants";
import ModalWeaponFilter from "@/app/components/ModalWeaponFilter";
import ModalSearchAndFilters from "@/app/components/ModalSearchAndFilters";

interface SkinSelectModalProps {
  weapon: string;
  selectedSkinId: string | null;
  skins: SkinWithFlags[];
  onSelect: (skin: SkinWithFlags) => void;
  onClose: () => void;
  currentIconUrl?: string | null;
}

/**
 * Modal for skin selection with infinite scroll and filtering
 * Supports ALL weapons mode or single weapon mode
 */
export default function SkinSelectModal({
  weapon,
  skins: initialSkins,
  onSelect,
  onClose,
  currentIconUrl,
}: SkinSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollection, setFilterCollection] = useState(false);
  const [filterWishlist, setFilterWishlist] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<string | undefined>(weapon === "ALL" ? undefined : weapon);
  const [allSkins, setAllSkins] = useState<SkinWithFlags[]>(initialSkins);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevWeaponRef = useRef(selectedWeapon);
  const prevSearchRef = useRef(searchQuery);
  const isInitialMount = useRef(true);

  // Fetch skins with pagination for both ALL and specific weapon modes
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const weaponChanged = prevWeaponRef.current !== selectedWeapon;
    const searchChanged = prevSearchRef.current !== searchQuery;
    const targetWeapon = weapon === "ALL" ? selectedWeapon : weapon;

    // If weapon or search changed or initial mount, reset and fetch page 1
    if (weaponChanged || searchChanged || isInitialMount.current) {
      isInitialMount.current = false;
      prevWeaponRef.current = selectedWeapon;
      prevSearchRef.current = searchQuery;
      
      const params = new URLSearchParams();
      if (targetWeapon) params.set("weapon", targetWeapon);
      if (searchQuery) params.set("search", searchQuery);
      params.set("page", "1");
      params.set("limit", ITEMS_PER_PAGE.toString());

      fetch(`/api/skins?${params.toString()}`)
        .then((res) => res.json())
        .then((data: SkinWithFlags[]) => {
          setAllSkins(data);
          setHasMore(data.length >= ITEMS_PER_PAGE);
          setPage(1);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load skins", err);
          setIsLoading(false);
        });
      
      Promise.resolve().then(() => {
        setAllSkins([]);
        setIsLoading(true);
      });
      return;
    }

    // Normal pagination fetch
    if (!hasMore || isLoading || page === 1) return;

    const params = new URLSearchParams();
    if (targetWeapon) params.set("weapon", targetWeapon);
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", page.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());

    Promise.resolve().then(() => setIsLoading(true));

    fetch(`/api/skins?${params.toString()}`)
      .then((res) => res.json())
      .then((data: SkinWithFlags[]) => {
        setHasMore(data.length >= ITEMS_PER_PAGE);
        setAllSkins((prev) => [...prev, ...data]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load skins", err);
        setIsLoading(false);
      });
  }, [weapon, selectedWeapon, searchQuery, page]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const skins = allSkins;

  // For "ALL" mode, filtering is done server-side (search is in the fetch)
  // For specific weapon mode, filter client-side
  const filteredSkins = useMemo(() => {
    if (weapon === "ALL") {
      // For ALL mode, only apply collection/wishlist filters client-side
      return skins.filter((skin) => {
        if (filterCollection && !skin.inCollection) return false;
        if (filterWishlist && !skin.inWishlist) return false;
        return true;
      });
    } else {
      // For specific weapon, apply all filters client-side
      return skins.filter((skin) => {
        // Search filter
        if (searchQuery && !skin.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Collection/Wishlist filter
        if (filterCollection && !skin.inCollection) return false;
        if (filterWishlist && !skin.inWishlist) return false;

        return true;
      });
    }
  }, [weapon, skins, searchQuery, filterCollection, filterWishlist]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      {/* MODAL */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {weapon === "ALL" ? "Select Icon" : `Select ${weapon} Skin`}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* SEARCH & FILTERS WITH CURRENT ICON */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              {/* WEAPON TABS - Only show when in ALL mode */}
              {weapon === "ALL" && (
                <ModalWeaponFilter
                  weapons={WEAPONS}
                  selectedWeapon={selectedWeapon}
                  onSelectWeapon={setSelectedWeapon}
                />
              )}

              <ModalSearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterCollection={filterCollection}
                onToggleCollection={() => setFilterCollection(!filterCollection)}
                filterWishlist={filterWishlist}
                onToggleWishlist={() => setFilterWishlist(!filterWishlist)}
              />
            </div>

            {/* CURRENT ICON */}
            {weapon === "ALL" && (
              <div className="flex-shrink-0">
                <div className="w-36 h-36 rounded-lg border border-neutral-700 bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {currentIconUrl ? (
                    <img
                      src={currentIconUrl}
                      alt="Current icon"
                      className="object-contain w-24 h-24"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">None</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredSkins.length === 0 && !isLoading ? (
            <p className="text-gray-400 text-sm">
              {skins.length === 0
                ? "No skins found."
                : "No skins match your search or filters."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {filteredSkins.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => onSelect(skin)}
                    className="group relative border border-neutral-700 rounded-lg p-2 bg-neutral-800 hover:border-red-500 transition cursor-pointer"
                  >
                    <div className="relative w-full aspect-square">
                      {skin.imageUrl ? (
                        <img
                          src={skin.imageUrl}
                          alt={skin.name}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* COLLECTION/WISHLIST BADGES */}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {skin.inCollection && (
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500"
                          title="In Collection"
                        />
                      )}
                      {skin.inWishlist && (
                        <div
                          className="w-2 h-2 rounded-full bg-purple-500"
                          title="In Wishlist"
                        />
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-300 text-center truncate group-hover:text-white">
                      {skin.name}
                    </p>
                  </button>
                ))}
              </div>

              {/* Loading indicator / Observer target */}
              <div ref={observerTarget} className="py-8 text-center">
                {isLoading && <p className="text-gray-400 text-sm">Loading more skins...</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
