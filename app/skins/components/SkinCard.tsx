/**
 * Skin Card Component
 * 
 * Displays skin preview in grid layouts.
 * Links to detailed skin page on click.
 */

/* eslint-disable @next/next/no-img-element */
import { Skin } from "@prisma/client";
import Link from "next/link";

interface SkinCardProps {
  skin: Skin;
}

/**
 * Clickable card showing skin image and basic info
 * Hover effect highlights border in red
 */
export default function SkinCard({ skin }: SkinCardProps) {
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
      <p className="text-sm text-gray-400">
        {skin.weapon}
      </p>
    </Link>
  );
}
