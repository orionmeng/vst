/**
 * Weapons Tab Component
 * 
 * Horizontal weapon filter tabs.
 * Updates URL search params when weapon is selected.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import clsx from "clsx";
import { WEAPONS } from "@/lib/constants";

/**
 * Weapon filter tabs
 * Active weapon highlighted in red, synced with URL params
 */
export default function WeaponsTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeWeapon = searchParams.get("weapon");

  function selectWeapon(weapon?: string) {
    const params = new URLSearchParams(searchParams);
    if (weapon) {
      params.set("weapon", weapon);
    } else {
      params.delete("weapon");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => selectWeapon(undefined)}
        className={clsx(
          "px-3 py-1 rounded text-sm border cursor-pointer",
          !activeWeapon
            ? "bg-red-600 border-red-500 text-white"
            : "bg-neutral-800 border-neutral-700 text-gray-300"
        )}
      >
        All
      </button>

      {WEAPONS.map((weapon) => (
        <button
          key={weapon}
          onClick={() => selectWeapon(weapon)}
          className={clsx(
            "px-3 py-1 rounded text-sm border cursor-pointer",
            activeWeapon === weapon
              ? "bg-red-600 border-red-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-gray-300 hover:border-gray-500"
          )}
        >
          {weapon}
        </button>
      ))}
    </div>
  );
}
