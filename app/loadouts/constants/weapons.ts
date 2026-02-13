/**
 * Weapon Display Configuration
 * 
 * Defines weapon groupings and scaling for loadout editor.
 * Organized by weapon categories with custom scale values.
 */

/**
 * Weapon groups with display scaling
 * Each group contains weapons with similar sizes/types
 * Scale values adjust image size for visual consistency
 */
export const WEAPON_GROUPS = [
  {
    label: "SIDEARMS",
    weapons: ["Classic", "Shorty", "Frenzy", "Ghost", "Bandit", "Sheriff"],
    scale: "scale-70",
    weaponScales: {
      "Shorty": "scale-90",
      "Ghost": "scale-90",
    },
  },
  {
    label: "SMGS",
    weapons: ["Stinger", "Spectre"],
    scale: "scale-90",
    weaponScales: {},
  },
  {
    label: "SHOTGUNS",
    weapons: ["Bucky", "Judge"],
    scale: "scale-100",
    weaponScales: {
      "Bucky": "scale-110",
    },
  },
  {
    label: "RIFLES",
    weapons: ["Bulldog", "Guardian", "Phantom", "Vandal"],
    scale: "scale-110",
    weaponScales: {
      "Guardian": "scale-120",
      "Phantom": "scale-115",
    },
  },
  {
    label: "MELEE",
    weapons: ["Melee"],
    scale: "scale-70",
    weaponScales: {},
  },
  {
    label: "MACHINE GUNS",
    weapons: ["Ares", "Odin"],
    scale: "scale-125",
    weaponScales: {},
  },
  {
    label: "SNIPER RIFLES",
    weapons: ["Marshal", "Outlaw", "Operator"],
    scale: "scale-115",
    weaponScales: {},
  },
];

export const COLUMN_LAYOUT = [
  [WEAPON_GROUPS[0]],
  [WEAPON_GROUPS[1], WEAPON_GROUPS[2]],
  [WEAPON_GROUPS[3], WEAPON_GROUPS[4]],
  [WEAPON_GROUPS[5], WEAPON_GROUPS[6]],
];

export type WeaponName =
  | "Classic" | "Shorty" | "Frenzy" | "Ghost" | "Bandit" | "Sheriff"
  | "Stinger" | "Spectre"
  | "Bucky" | "Judge"
  | "Bulldog" | "Guardian" | "Phantom" | "Vandal"
  | "Melee"
  | "Ares" | "Odin"
  | "Marshal" | "Outlaw" | "Operator";
