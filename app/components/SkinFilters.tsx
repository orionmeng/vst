/**
 * Skin Filters Component
 * 
 * Search input and weapon tabs for filtering skins.
 * Syncs with URL search params for shareable filtered views.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WeaponsTab from "./WeaponsTab";

interface SkinFiltersProps {
  layout?: "row" | "column";
}

/**
 * Filter controls for skins pages
 * Includes debounced search and weapon tabs
 */
export default function SkinFilters({ layout = "row" }: SkinFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, router, pathname, searchParams]);

  const containerClass = layout === "row" 
    ? "flex flex-col md:flex-row gap-4 items-start md:items-center"
    : "space-y-4";

  const inputClass = layout === "row"
    ? "w-full md:w-120 p-3 rounded bg-neutral-800 border border-neutral-700 text-white"
    : "w-full max-w-md p-3 rounded bg-neutral-800 border border-neutral-700 text-white";

  return (
    <div className={containerClass}>
      <input
        type="text"
        placeholder="Search skins..."
        className={inputClass}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <WeaponsTab />
    </div>
  );
}
