export const TIER_ICONS: Record<string, { name: string; icon: string }> = {
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": {
    name: "Deluxe Edition",
    icon: "https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png",
  },
  "e046854e-406c-37f4-6607-19a9ba8426fc": {
    name: "Exclusive Edition",
    icon: "https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png",
  },
  "60bca009-4182-7998-dee7-b8a2558dc369": {
    name: "Premium Edition",
    icon: "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png",
  },
  "12683d76-48d7-84a3-4e09-6985794f0445": {
    name: "Select Edition",
    icon: "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png",
  },
  "411e4a55-4e59-7757-41f0-86a53f101bb5": {
    name: "Ultra Edition",
    icon: "https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png",
  },
};

export function getTierInfo(tierId: string) {
  return TIER_ICONS[tierId] || { name: "Unknown", icon: null };
}
