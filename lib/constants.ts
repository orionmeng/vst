import { JsonValue } from "@prisma/client/runtime/library";

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

export const ITEMS_PER_PAGE = 20;

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

export type SkinWithFlags = {
  id: string;
  name: string;
  weapon: string;
  imageUrl: string | null;
  inCollection?: boolean;
  inWishlist?: boolean;
};

export type BasicSkin = {
  id: string;
  name: string;
  weapon: string;
  imageUrl: string | null;
};

