"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import WeaponsTab from "./WeaponsTab";
import { TIERS, TIER_ICONS } from "@/lib/tiers";

interface SkinFiltersProps {
  layout?: "row" | "column";
}

export default function SkinFilters({ layout = "row" }: SkinFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const activeTiers = new Set(
    searchParams.get("tiers")?.split(",").filter(Boolean) ?? []
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

  function toggleTier(tierId: string) {
    const params = new URLSearchParams(searchParams);
    const current = new Set(
      params.get("tiers")?.split(",").filter(Boolean) ?? []
    );

    if (current.has(tierId)) {
      current.delete(tierId);
    } else {
      current.add(tierId);
    }

    if (current.size > 0) {
      params.set("tiers", Array.from(current).join(","));
    } else {
      params.delete("tiers");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const containerClass = layout === "row" 
    ? "flex flex-col md:flex-row gap-4 items-start md:items-center"
    : "space-y-4";

  const inputClass = layout === "row"
    ? "w-full md:w-120 p-3 rounded bg-neutral-800 border border-neutral-700 text-white"
    : "w-full max-w-md p-3 rounded bg-neutral-800 border border-neutral-700 text-white";

  return (
    <div className="space-y-4">
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

      {/* Rarity Filters */}
      <div className="flex flex-wrap gap-2">
        {TIERS.map((tier) => {
          const info = TIER_ICONS[tier.id];
          const isActive = activeTiers.has(tier.id);
          return (
            <button
              key={tier.id}
              onClick={() => toggleTier(tier.id)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded text-sm border cursor-pointer transition",
                isActive
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-neutral-800 border-neutral-700 text-gray-300 hover:border-gray-500"
              )}
            >
              {info?.icon && (
                <img src={info.icon} alt={tier.name} className="w-4 h-4" />
              )}
              {tier.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
