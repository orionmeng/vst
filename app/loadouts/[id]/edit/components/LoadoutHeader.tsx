/**
 * Loadout Editor Header Component
 * 
 * Top bar for loadout editor with name editing and action buttons.
 * Shows Save/Create, Download, and Exit/Cancel buttons.
 */

"use client";

import Link from "next/link";

interface LoadoutHeaderProps {
  loadoutName: string;
  isEditingName: boolean;
  isLoading: boolean;
  hasBeenSaved: boolean;
  hasUnsavedChanges: boolean;
  isAuthenticated: boolean;
  onNameChange: (name: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
  onSave: () => void;
  onDownload: () => void;
  onExport: () => void;
}

/**
 * Header bar with editable loadout name and action buttons
 * Handles inline name editing with Enter key support
 */
export default function LoadoutHeader({
  loadoutName,
  isEditingName,
  isLoading,
  hasBeenSaved,
  hasUnsavedChanges,
  isAuthenticated,
  onNameChange,
  onEditStart,
  onEditEnd,
  onSave,
  onDownload,
  onExport,
}: LoadoutHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-8">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-6 py-4 flex items-center justify-between">
        {/* NAME ON LEFT */}
        {isEditingName ? (
          <input
            type="text"
            value={loadoutName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onEditEnd}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditEnd();
            }}
            placeholder="Enter loadout name..."
            maxLength={26}
            className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 max-w-xs"
            autoFocus
          />
        ) : (
          <button
            onClick={onEditStart}
            className="text-2xl font-bold hover:text-red-500 transition cursor-pointer"
          >
            {loadoutName || "Unnamed Loadout"}
          </button>
        )}

        {/* BUTTONS ON RIGHT */}
        <div className="flex gap-2">
          {isAuthenticated && (
            <button
              onClick={onSave}
              disabled={isLoading || (hasBeenSaved && !hasUnsavedChanges)}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:bg-red-800 disabled:cursor-not-allowed cursor-pointer text-sm font-semibold"
            >
              {isLoading ? "Saving..." : hasBeenSaved ? "Save" : "Create"}
            </button>
          )}
          <button
            onClick={onDownload}
            className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-sm font-semibold"
          >
            Download
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition cursor-pointer text-sm font-semibold"
          >
            Export
          </button>
          <Link
            href="/loadouts"
            className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition text-sm font-semibold text-center"
          >
            {hasBeenSaved && !hasUnsavedChanges ? "Exit" : "Cancel"}
          </Link>
        </div>
      </div>
    </div>
  );
}
