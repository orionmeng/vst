import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type WeaponResponse = {
  data: {
    displayName: string;
    skins: {
      uuid: string;
    }[];
  }[];
};

type SkinResponse = {
  data: {
    uuid: string;
    displayName: string;
    contentTierUuid: string | null;
    chromas: {
      uuid: string;
      fullRender: string | null;
      swatch: string | null;
    }[];
    levels: {
      streamedVideo: string | null;
    }[];
  }[];
};

// Valorant skin prices by content tier UUID
const TIER_COSTS: Record<string, number> = {
  "12683d76-48d7-84a3-4e09-6985794f0445": 875,   // Select
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": 1275,  // Deluxe
  "60bca009-4182-7998-dee7-b8a2558dc369": 1775,  // Premium
  "e046854e-406c-37f4-6607-19a9ba8426fc": 2175,  // Exclusive
  "411e4a55-4e59-7757-41f0-86a53f101bb5": 2475,  // Ultra
};

async function main() {
  console.log("Fetching weapons...");

  const weaponsRes = await fetch("https://valorant-api.com/v1/weapons");
  if (!weaponsRes.ok) throw new Error("Failed to fetch weapons");

  const weaponsJson = (await weaponsRes.json()) as WeaponResponse;

  const skinToWeapon = new Map<string, string>();

  for (const weapon of weaponsJson.data) {
    for (const skin of weapon.skins) {
      skinToWeapon.set(skin.uuid, weapon.displayName);
    }
  }

  console.log("Fetching skins...");

  const skinsRes = await fetch("https://valorant-api.com/v1/weapons/skins");
  if (!skinsRes.ok) throw new Error("Failed to fetch skins");

  const skinsJson = (await skinsRes.json()) as SkinResponse;

  let count = 0;

  for (const skin of skinsJson.data) {
    if (!skin.displayName || !skin.chromas.length) continue;

    const weapon = skinToWeapon.get(skin.uuid);
    if (!weapon) continue;

    const imageUrl =
      skin.chromas.find((c) => c.fullRender)?.fullRender ?? null;

    if (!imageUrl) continue;

    const cost = TIER_COSTS[skin.contentTierUuid ?? ""] ?? 0;

    await prisma.skin.upsert({
      where: { id: skin.uuid },
      update: {
        levels: skin.levels as unknown as Prisma.InputJsonValue,
        cost,
      },
      create: {
        id: skin.uuid,
        name: skin.displayName,
        weapon,
        tier: skin.contentTierUuid ?? "Unknown",
        cost,
        imageUrl,
        chromas: skin.chromas as unknown as Prisma.InputJsonValue,
        levels: skin.levels as unknown as Prisma.InputJsonValue,
        videoUrl: skin.levels[0]?.streamedVideo ?? null,
      },
    });

    count++;
  }

  console.log(`Seeded ${count} skins`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
