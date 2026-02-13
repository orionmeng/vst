/**
 * Modal Weapon Filter Component
 * 
 * Horizontal weapon filter buttons for skin selection modal.
 * Includes "All" option to clear weapon filter.
 */

"use client";

import clsx from "clsx";

interface ModalWeaponFilterProps {
  weapons: readonly string[];
  selectedWeapon: string | undefined;
  onSelectWeapon: (weapon: string | undefined) => void;
}

/**
 * Weapon filter buttons for modal
 * Allows filtering skins by weapon type
 */
export default function ModalWeaponFilter({
  weapons,
  selectedWeapon,
  onSelectWeapon,
}: ModalWeaponFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectWeapon(undefined)}
        className={clsx(
          "px-3 py-1 rounded text-sm border cursor-pointer",
          !selectedWeapon
            ? "bg-red-600 border-red-500 text-white"
            : "bg-neutral-800 border-neutral-700 text-gray-300"
        )}
      >
        All
      </button>
      {weapons.map((weapon) => (
        <button
          key={weapon}
          onClick={() => onSelectWeapon(weapon)}
          className={clsx(
            "px-3 py-1 rounded text-sm border cursor-pointer",
            selectedWeapon === weapon
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
