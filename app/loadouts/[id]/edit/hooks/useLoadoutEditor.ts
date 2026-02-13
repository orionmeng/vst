/**
 * Loadout Editor Hook
 * 
 * Manages all state and logic for loadout creation/editing.
 * Handles weapon selection, saving, downloading, and unsaved changes warnings.
 */

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import * as htmlToImage from 'html-to-image';
import { BasicSkin } from "@/lib/constants";

type LoadoutState = Record<string, { skinId: string | null; imageUrl: string | null; name: string | null }>;
type StandardImageMap = Record<string, string | null>;
type SavedLoadout = {
  id: string;
  name: string;
  icon?: string | null;
  entries: Array<{ weapon: string; skin: { id: string; name: string; imageUrl: string | null } | null }>;
  createdAt: string;
};

interface UseLoadoutEditorProps {
  loadoutId: string;
  isNewLoadout: boolean;
  shouldAutoDownload: boolean;
}

/**
 * Custom hook for loadout editor functionality
 * Manages weapon selection, save/download operations, and unsaved changes tracking
 */
export function useLoadoutEditor({ loadoutId, isNewLoadout, shouldAutoDownload }: UseLoadoutEditorProps) {
  const { data: session, status } = useSession();
  
  const [loadout, setLoadout] = useState<LoadoutState>({});
  const [standardImages, setStandardImages] = useState<StandardImageMap>({});
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [skins, setSkins] = useState<BasicSkin[]>([]);
  const [loadoutName, setLoadoutName] = useState("Unnamed Loadout");
  const [loadoutIcon, setLoadoutIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pageLoading, setPageLoading] = useState(!isNewLoadout);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadPreview, setDownloadPreview] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(!isNewLoadout);
  const gridRef = useRef<HTMLDivElement>(null);
  const autoDownloadTriggered = useRef(false);

  // Load standard images on mount
  useEffect(() => {
    fetch("/api/skins/standard")
      .then((res) => res.json())
      .then((data) => setStandardImages(data))
      .catch((err) => console.error("Failed to load standard images", err));
  }, []);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.includes(window.location.pathname)) {
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasUnsavedChanges]);

  // Load existing loadout if editing
  useEffect(() => {
    if (isNewLoadout) return;

    fetch(`/api/loadouts/${loadoutId}`)
      .then((res) => res.json())
      .then((loadoutData: SavedLoadout) => {
        setLoadoutName(loadoutData.name);
        setLoadoutIcon(loadoutData.icon || null);

        const loadoutState: LoadoutState = {};
        loadoutData.entries.forEach((entry) => {
          loadoutState[entry.weapon] = {
            skinId: entry.skin?.id || null,
            imageUrl: entry.skin?.imageUrl || null,
            name: entry.skin?.name || null,
          };
        });
        setLoadout(loadoutState);
      })
      .catch((err) => console.error("Failed to load loadout", err))
      .finally(() => setPageLoading(false));
  }, [isNewLoadout, loadoutId]);

  // Save to localStorage when loadout changes
  useEffect(() => {
    localStorage.setItem("valorant-loadout", JSON.stringify(loadout));
  }, [loadout]);

  // Load skins for active weapon
  useEffect(() => {
    if (!activeWeapon) return;

    const params = new URLSearchParams();
    params.set("weapon", activeWeapon);

    fetch(`/api/skins?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setSkins(data))
      .catch((err) => console.error("Failed to load skins", err));
  }, [activeWeapon]);

  const handleDownloadClick = async () => {
    if (!gridRef.current) return;

    try {
      gridRef.current.setAttribute('data-capturing', 'true');
      
      const images = gridRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      const originalPadding = gridRef.current.style.padding;
      gridRef.current.style.padding = '40px';

      const dataUrl = await htmlToImage.toPng(gridRef.current, {
        quality: 1,
        backgroundColor: '#171717',
        pixelRatio: 2,
      });

      gridRef.current.style.padding = originalPadding;
      gridRef.current.removeAttribute('data-capturing');

      setDownloadPreview(dataUrl);
      setShowDownloadModal(true);
    } catch (err) {
      console.error("Failed to generate preview", err);
      if (gridRef.current) {
        gridRef.current.style.padding = '';
        gridRef.current.removeAttribute('data-capturing');
      }
      setSaveMessage({ type: "error", text: "Failed to generate preview" });
    }
  };

  // Auto-trigger download if coming from loadouts page
  useEffect(() => {
    if (shouldAutoDownload && !pageLoading && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      
      const url = new URL(window.location.href);
      url.searchParams.delete('download');
      window.history.replaceState({}, '', url);
      
      setTimeout(() => {
        handleDownloadClick();
      }, 500);
    }
  }, [shouldAutoDownload, pageLoading]);

  const selectSkin = (skin: { id: string; name: string; imageUrl: string | null }) => {
    if (!activeWeapon) return;

    setLoadout((prev) => ({
      ...prev,
      [activeWeapon]: { skinId: skin.id, imageUrl: skin.imageUrl, name: skin.name },
    }));
    setHasUnsavedChanges(true);
    setActiveWeapon(null);
  };

  const handleSave = () => {
    if (!session?.user) {
      setSaveMessage({ type: "error", text: "Please sign in to save loadouts" });
      return;
    }

    const skinIdMap = Object.entries(loadout).reduce((acc, [weapon, data]) => {
      if (data.skinId) {
        acc[weapon as keyof typeof loadout] = data.skinId;
      }
      return acc;
    }, {} as Record<string, string>);

    setIsLoading(true);

    const method = isNewLoadout ? "POST" : "PUT";
    const url = isNewLoadout ? "/api/loadouts" : `/api/loadouts/${loadoutId}`;
    const finalName = loadoutName.trim() || "Unnamed Loadout";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: finalName, entries: skinIdMap }),
    })
      .then(async (res) => {
        if (res.ok) {
          setHasUnsavedChanges(false);
          setHasBeenSaved(true);
          setSaveMessage({ type: "success", text: isNewLoadout ? "Loadout created!" : "Loadout updated!" });
          setTimeout(() => setSaveMessage(null), 3000);
        } else {
          setSaveMessage({ type: "error", text: "Failed to save loadout" });
        }
      })
      .catch((err) => {
        console.error("Error saving loadout", err);
        setSaveMessage({ type: "error", text: "Error saving loadout" });
      })
      .finally(() => setIsLoading(false));
  };

  const handleDownloadConfirm = () => {
    if (!downloadPreview) return;

    const link = document.createElement("a");
    link.download = `${loadoutName || "loadout"}.png`;
    link.href = downloadPreview;
    link.click();

    setShowDownloadModal(false);
    setDownloadPreview(null);
  };

  const handleDownloadCancel = () => {
    setShowDownloadModal(false);
    setDownloadPreview(null);
  };

  /**
   * Export loadout as JSON file
   * Converts current loadout state to exportable format and downloads as .json file
   */
  const handleExport = () => {
    // Convert loadout state to exportable format
    const exportData: {
      name: string;
      icon?: string;
      entries: Record<string, string>;
    } = {
      name: loadoutName,
      entries: Object.entries(loadout).reduce((acc, [weapon, skin]) => {
        if (skin.skinId) {
          acc[weapon] = skin.skinId;
        }
        return acc;
      }, {} as Record<string, string>),
    };

    // Only include icon if it exists
    if (loadoutIcon) {
      exportData.icon = loadoutIcon;
    }

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${loadoutName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_loadout.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    // State
    loadout,
    standardImages,
    activeWeapon,
    skins,
    loadoutName,
    isLoading,
    saveMessage,
    pageLoading,
    isEditingName,
    showDownloadModal,
    downloadPreview,
    hasUnsavedChanges,
    hasBeenSaved,
    gridRef,
    session,
    status,
    
    // Actions
    setActiveWeapon,
    setLoadoutName,
    setIsEditingName,
    setHasUnsavedChanges,
    selectSkin,
    handleSave,
    handleDownloadClick,
    handleDownloadConfirm,
    handleDownloadCancel,
    handleExport,
  };
}
