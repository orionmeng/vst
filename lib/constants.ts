/**
 * Shared constants used throughout the application
 */

import { JsonValue } from "@prisma/client/runtime/library";

/**
 * List of all weapons in Valorant
 * Update this list if new weapons are added to the game
 */
export const WEAPONS = [
  "Ares",
  "Bandit",
  "Bucky",
  "Bulldog",
  "Classic",
  "Frenzy",
  "Ghost",
  "Guardian",
  "Judge",
  "Marshal",
  "Melee",
  "Odin",
  "Operator",
  "Outlaw",
  "Phantom",
  "Sheriff",
  "Shorty",
  "Spectre",
  "Stinger",
  "Vandal",
] as const;

/**
 * Number of items to load per page for infinite scroll
 */
export const ITEMS_PER_PAGE = 20;

/**
 * Shared type definitions
 */

/**
 * Full skin type with all properties (used in grid displays)
 */
export type Skin = {
  id: string;
  name: string;
  weapon: string;
  imageUrl: string | null;
  cost: number;
  tier: string;
  chromas: JsonValue;
  levels: JsonValue;
  videoUrl: string | null;
};

/**
 * Skin type with collection/wishlist flags (used in modals)
 */
export type SkinWithFlags = {
  id: string;
  name: string;
  weapon: string;
  imageUrl: string | null;
  inCollection?: boolean;
  inWishlist?: boolean;
};

/**
 * Basic skin type (used in loadout editor)
 */
export type BasicSkin = {
  id: string;
  name: string;
  weapon: string;
  imageUrl: string | null;
};

