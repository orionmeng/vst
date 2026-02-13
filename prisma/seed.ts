/**
 * Database Seed Script
 * 
 * Populates database with Valorant skins from official API.
 * Run with: npx prisma db seed
 */

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

/**
 * Main seed function
 * Fetches weapons and skins from Valorant API and inserts into database
 */
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

    await prisma.skin.upsert({
      where: { id: skin.uuid },
      update: {
        levels: skin.levels as unknown as Prisma.InputJsonValue,
      },
      create: {
        id: skin.uuid,
        name: skin.displayName,
        weapon,
        tier: skin.contentTierUuid ?? "Unknown",
        cost: 0,
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
