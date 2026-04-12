export const TIER_ICONS: Record<string, { name: string; icon: string }> = {
  "e046854e-406c-37f4-6607-19a9ba8426fc": {
    name: "Exclusive Edition",
    icon: "https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png",
  },
  "60bca009-4182-7998-dee7-b8a2558dc369": {
    name: "Premium Edition",
    icon: "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png",
  },
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": {
    name: "Deluxe Edition",
    icon: "https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png",
  },
  "12683d76-48d7-84a3-4e09-6985794f0445": {
    name: "Select Edition",
    icon: "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png",
  },
};

// Ordered from highest to lowest rarity (used for sorting and filter UI)
export const TIERS = [
  { id: "e046854e-406c-37f4-6607-19a9ba8426fc", name: "Exclusive", rank: 3 },
  { id: "60bca009-4182-7998-dee7-b8a2558dc369", name: "Premium", rank: 2 },
  { id: "0cebb8be-46d7-c12a-d306-e9907bfc5a25", name: "Deluxe", rank: 1 },
  { id: "12683d76-48d7-84a3-4e09-6985794f0445", name: "Select", rank: 0 },
] as const;

export const TIER_RANK: Record<string, number> = Object.fromEntries(
  TIERS.map((t) => [t.id, t.rank])
);

export function getTierInfo(tierId: string) {
  return TIER_ICONS[tierId] || { name: "Unknown", icon: null };
}
