/**
 * Weapon Column Component
 * 
 * Vertical column of weapon slots for loadout display.
 * Maps weapon names to skin images.
 */

import WeaponSlot from "./WeaponSlot";
import { WeaponName } from "../constants/weapons";

type Props = {
  weapons: readonly WeaponName[];
  loadout: Record<WeaponName, string | null>;
  skinImages: Record<string, string | null>;
  onSelectWeapon: (weapon: WeaponName) => void;
};

/**
 * Renders vertical list of weapon slots
 * Used in loadout page display
 */
export default function WeaponColumn({
  weapons,
  loadout,
  skinImages,
  onSelectWeapon,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {weapons.map((weapon) => {
        const skinId = loadout[weapon];
        const imageUrl = skinId ? skinImages[skinId] ?? null : null;

        return (
          <WeaponSlot
            key={weapon}
            weapon={weapon}
            imageUrl={imageUrl}
            onClick={() => onSelectWeapon(weapon)}
          />
        );
      })}
    </div>
  );
}
