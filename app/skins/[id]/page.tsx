/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getTierInfo } from "@/lib/tierIcons";

import SkinMedia from "./components/SkinMedia";

type Chroma = {
  uuid: string;
  fullRender: string | null;
  swatch: string | null;
};

type Level = {
  streamedVideo: string | null;
};

interface SkinPageProps {
  params: {
    id: string;
  };
}

export default async function SkinPage({ params }: SkinPageProps) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id;

  const skin = await prisma.skin.findUnique({
    where: { id: params.id },
    include: session?.user?.id
      ? {
          wishlistEntries: {
            where: { userId: session.user.id },
          },
          collectionEntries: {
            where: { userId: session.user.id },
          },
        }
      : undefined,
  });

  if (!skin) {
    notFound();
  }

  const chromas = skin.chromas as unknown as Chroma[];
  const levels = (skin.levels as unknown as Level[]) || [];
  const isWishlisted = ((skin as { wishlistEntries?: { id: string }[] }).wishlistEntries ?? []).length > 0;
  const isCollected = ((skin as { collectionEntries?: { id: string }[] }).collectionEntries ?? []).length > 0;
  const tierInfo = getTierInfo(skin.tier);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="mb-8 space-y-3">
        <h1 className="text-4xl font-bold text-white">
          {skin.name}
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-lg text-gray-400">{skin.weapon}</p>
          {tierInfo.icon && (
            <div className="flex items-center gap-2">
              <img
                src={tierInfo.icon}
                alt={tierInfo.name}
                title={tierInfo.name}
                className="w-7 h-7"
              />
              <span className="text-sm text-gray-400">{tierInfo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* MEDIA SECTION */}
      <SkinMedia
        imageUrl={skin.imageUrl}
        videoUrl={skin.videoUrl}
        chromas={chromas}
        levels={levels}
        skinId={skin.id}
        initialWishlisted={isWishlisted}
        initialCollected={isCollected}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
