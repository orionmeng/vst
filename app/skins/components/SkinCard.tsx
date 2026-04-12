/* eslint-disable @next/next/no-img-element */
import { Skin } from "@prisma/client";
import Link from "next/link";
import { getTierInfo } from "@/lib/tiers";

interface SkinCardProps {
  skin: Skin;
}

export default function SkinCard({ skin }: SkinCardProps) {
  const tierInfo = getTierInfo(skin.tier);

  return (
    <Link
      href={`/skins/${skin.id}`}
      className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-red-500 transition block"
    >
      <div className="aspect-square bg-neutral-900 rounded mb-3 flex items-center justify-center overflow-hidden">
        {skin.imageUrl ? (
          <img
            src={skin.imageUrl}
            alt={skin.name}
            className="object-contain w-full h-full hover:scale-105 transition"
          />
        ) : (
          <div className="text-gray-500 text-sm">No image</div>
        )}
      </div>

      <h3 className="text-white font-semibold truncate">{skin.name}</h3>
      <div className="flex items-center gap-1.5 text-sm text-gray-400">
        <span>{skin.weapon}</span>
        {tierInfo.icon && (
          <img
            src={tierInfo.icon}
            alt={tierInfo.name}
            title={tierInfo.name}
            className="w-4 h-4 inline-block"
          />
        )}
        {skin.cost > 0 && (
          <span>{skin.cost.toLocaleString()} VP</span>
        )}
      </div>
    </Link>
  );
}
