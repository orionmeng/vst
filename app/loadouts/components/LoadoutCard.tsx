/**
 * Loadout Card Component
 * 
 * Displays loadout preview with hover actions.
 * Shows loadout icon or first skin, with edit/download/delete controls.
 */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";

type SavedLoadout = {
  id: string;
  name: string;
  icon?: string | null;
  entries: Array<{ weapon: string; skin: { id: string; name: string; imageUrl: string | null } | null }>;
  createdAt: string;
};

interface LoadoutCardProps {
  loadout: SavedLoadout;
  onDelete: (id: string) => void;
  onDownload: (loadout: SavedLoadout) => void;
  onExport: (loadout: SavedLoadout) => void;
  onSetIcon: (loadout: SavedLoadout) => void;
}

/**
 * Interactive loadout card with hover actions
 * Handles image errors and displays action buttons on hover
 */
export default function LoadoutCard({ loadout, onDelete, onDownload, onExport, onSetIcon }: LoadoutCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get icon or first skin image, ensuring we filter out empty strings and null values
  const iconUrl = loadout.icon && loadout.icon.trim() ? loadout.icon : null;
  const firstSkinImage = loadout.entries.find((e) => e.skin?.imageUrl)?.skin?.imageUrl || null;
  const displayImage = iconUrl || firstSkinImage;

  // Reset imageError when displayImage changes
  useEffect(() => {
    setImageError(false);
  }, [displayImage]);

  return (
    <div
      className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-red-500 transition relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="aspect-square bg-neutral-900 rounded mb-3 flex items-center justify-center overflow-hidden">
        {displayImage && !imageError ? (
          <img
            key={displayImage}
            src={displayImage}
            alt={loadout.name}
            onError={() => setImageError(true)}
            className="object-contain w-full h-full hover:scale-105 transition scale-90"
          />
        ) : (
          <div className="text-gray-500 text-sm text-center">Set an icon!</div>
        )}
      </div>

      <h3 className="text-white font-semibold truncate">{loadout.name}</h3>

      {/* ACTION BUTTONS - SHOWN ON HOVER */}
      {showActions && (
        <div className="absolute inset-0 bg-black/80 rounded-xl p-4 flex flex-col gap-2 justify-center">
          <button
            onClick={() => onSetIcon(loadout)}
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-xs font-semibold"
          >
            Set Icon
          </button>
          <button
            onClick={() => {
              window.location.href = `/loadouts/${loadout.id}/edit`;
            }}
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-xs font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => onDownload(loadout)}
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-xs font-semibold"
          >
            Download
          </button>
          <button
            onClick={() => onExport(loadout)}
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-xs font-semibold"
          >
            Export
          </button>
          <button
            onClick={() => onDelete(loadout.id)}
            className="w-full px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition cursor-pointer text-xs font-semibold"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
