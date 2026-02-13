/**
 * Weapon Grid Component
 * 
 * 4-column grid layout of all weapons for loadout editor.
 * Each weapon shows selected skin or standard image.
 * Organized by weapon categories (Sidearms, SMGs, etc.).
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { RefObject } from "react";
import { COLUMN_LAYOUT } from "../../../constants/weapons";

type LoadoutState = Record<string, { skinId: string | null; imageUrl: string | null; name: string | null }>;
type StandardImageMap = Record<string, string | null>;

interface WeaponGridProps {
  loadout: LoadoutState;
  standardImages: StandardImageMap;
  gridRef: RefObject<HTMLDivElement | null>;
  onWeaponClick: (weapon: string) => void;
}

/**
 * Main weapon grid for loadout editor
 * Used for both editing and screenshot capture
 */
export default function WeaponGrid({
  loadout,
  standardImages,
  gridRef,
  onWeaponClick,
}: WeaponGridProps) {
  return (
    <div className="p-0">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div 
          ref={gridRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 [&[data-capturing]_button]:pointer-events-none [&[data-capturing]_button]:!border-neutral-700"
          style={{ backgroundColor: '#171717' }}
        >
          {COLUMN_LAYOUT.map((column) => (
            <div key={column.map((g) => g.label).join("-")}>
              {column.map((group) => (
                <div key={group.label} className="mb-8 last:mb-0">
                  <h2 className="text-lg font-semibold text-white mb-4 text-center">{group.label}</h2>
                  <div className="flex flex-col gap-4">
                    {group.weapons.map((weapon) => {
                      const weaponLoadout = loadout[weapon];
                      const imageUrl = weaponLoadout?.imageUrl || standardImages[weapon] || null;
                      const weaponScale = group.weaponScales?.[weapon as keyof typeof group.weaponScales] || group.scale;

                      return (
                        <button
                          key={weapon}
                          onClick={() => onWeaponClick(weapon)}
                          className="group bg-neutral-900 border border-neutral-700 rounded-lg hover:border-red-500 transition text-left overflow-hidden cursor-pointer"
                        >
                          <div className="relative aspect-[6/2] bg-neutral-800 rounded flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={weapon}
                                className={`object-contain ${weaponScale}`}
                                style={{ width: '200px', height: '100px' }}
                              />
                            ) : (
                              <span className="text-xs text-gray-500">Select skin</span>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-2 text-left">
                              <div className="text-sm font-medium text-white">{weapon}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
