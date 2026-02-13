/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import LoadoutCard from "./components/LoadoutCard";
import SkinSelectModal from "./components/SkinSelectModal";
import ImportModal, { LoadoutImportData } from "./components/ImportModal";

type SavedLoadout = {
  id: string;
  name: string;
  icon?: string | null;
  entries: Array<{ weapon: string; skin: { id: string; name: string; imageUrl: string | null } | null }>;
  createdAt: string;
};

export default function LoadoutsPage() {
  const { data: session, status } = useSession();
  const [savedLoadouts, setSavedLoadouts] = useState<SavedLoadout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedLoadout, setSelectedLoadout] = useState<SavedLoadout | null>(null);

  // Load saved loadouts
  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    fetch("/api/loadouts")
      .then((res) => res.json())
      .then((data) => setSavedLoadouts(data.sort((a: SavedLoadout, b: SavedLoadout) => a.name.localeCompare(b.name))))
      .catch((err) => console.error("Failed to load loadouts", err))
      .finally(() => setIsLoading(false));
  }, [status]);

  const handleDelete = async (loadoutId: string) => {
    if (!confirm("Are you sure you want to delete this loadout?")) return;

    try {
      const res = await fetch(`/api/loadouts/${loadoutId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedLoadouts((prev) => prev.filter((l) => l.id !== loadoutId));
      }
    } catch (err) {
      console.error("Failed to delete loadout", err);
    }
  };

  const handleDownload = (loadout: SavedLoadout) => {
    // Redirect to edit page with download param to auto-trigger download
    window.location.href = `/loadouts/${loadout.id}/edit?download=true`;
  };

  const handleExport = (loadout: SavedLoadout) => {
    // Convert loadout to exportable format
    const exportData: {
      name: string;
      icon?: string;
      entries: Record<string, string>;
    } = {
      name: loadout.name,
      entries: loadout.entries.reduce((acc, entry) => {
        if (entry.skin) {
          acc[entry.weapon] = entry.skin.id;
        }
        return acc;
      }, {} as Record<string, string>),
    };

    // Only include icon if it exists
    if (loadout.icon) {
      exportData.icon = loadout.icon;
    }

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${loadout.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_loadout.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSetIcon = (loadout: SavedLoadout) => {
    setSelectedLoadout(loadout);
    setShowIconModal(true);
  };

  const handleIconSelect = async (skin: { id: string; name: string; imageUrl: string | null }) => {
    if (!selectedLoadout) return;

    try {
      const res = await fetch(`/api/loadouts/${selectedLoadout.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedLoadout.name,
          icon: skin.imageUrl,
          entries: selectedLoadout.entries.reduce((acc, entry) => {
            if (entry.skin) {
              acc[entry.weapon] = entry.skin.id;
            }
            return acc;
          }, {} as Record<string, string>),
        }),
      });

      if (res.ok) {
        // Update the loadout in state
        setSavedLoadouts((prev) =>
          prev.map((l) =>
            l.id === selectedLoadout.id ? { ...l, icon: skin.imageUrl } : l
          )
        );
        setShowIconModal(false);
        setSelectedLoadout(null);
      }
    } catch (err) {
      console.error("Failed to update icon", err);
    }
  };

  const handleImport = async (data: LoadoutImportData) => {
    try {
      const res = await fetch("/api/loadouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to import loadout");
      }

      const newLoadout = await res.json();
      setSavedLoadouts((prev) => [...prev, newLoadout].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      throw err; // Re-throw to be caught by ImportModal
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-white mb-8">
        My Loadouts
      </h1>

      {/* CREATE NEW BUTTON */}
      <div className="mb-8 flex gap-4 flex-wrap">
        {status === "authenticated" && savedLoadouts.length >= 8 ? (
          <div className="inline-block px-6 py-3 rounded bg-neutral-800 text-gray-400 font-semibold">
            Maximum loadouts reached (8/8)
          </div>
        ) : (
          <Link
            href="/loadouts/new/edit"
            className="inline-block px-6 py-3 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition font-semibold"
          >
            {status === "authenticated" 
              ? `Create New Loadout (${savedLoadouts.length}/8)`
              : "Create Loadout"
            }
          </Link>
        )}
        
        {status === "authenticated" && savedLoadouts.length < 8 && (
          <button
            onClick={() => setShowImportModal(true)}
            className="px-6 py-3 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition font-semibold cursor-pointer"
          >
            Import Loadout
          </button>
        )}
      </div>

      {/* LOADOUTS GRID - Only for authenticated users */}
      {status === "authenticated" ? (
        savedLoadouts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No loadouts yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {savedLoadouts.map((loadout) => (
              <LoadoutCard
                key={loadout.id}
                loadout={loadout}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onExport={handleExport}
                onSetIcon={handleSetIcon}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-400 border border-neutral-700 rounded-xl p-8">
          <p className="mb-2">Sign in to save and manage your loadouts!</p>
          <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 transition font-semibold">
            Sign In
          </Link>
        </div>
      )}

      {/* ICON SELECTION MODAL */}
      {showIconModal && selectedLoadout && (
        <SkinSelectModal
          weapon="ALL"
          selectedSkinId={null}
          skins={[]}
          currentIconUrl={selectedLoadout.icon}
          onSelect={handleIconSelect}
          onClose={() => {
            setShowIconModal(false);
            setSelectedLoadout(null);
          }}
        />
      )}

      {/* IMPORT MODAL */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
}
