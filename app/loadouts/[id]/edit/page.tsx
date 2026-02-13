"use client";

import { useSearchParams } from "next/navigation";
import SkinSelectModal from "../../components/SkinSelectModal";
import DownloadModal from "../../components/DownloadModal";
import LoadoutHeader from "./components/LoadoutHeader";
import WeaponGrid from "./components/WeaponGrid";
import { useLoadoutEditor } from "./hooks/useLoadoutEditor";

export default function LoadoutEditorPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const isNewLoadout = params.id === "new";
  const shouldAutoDownload = searchParams.get("download") === "true";

  const {
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
    status,
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
  } = useLoadoutEditor({
    loadoutId: params.id,
    isNewLoadout,
    shouldAutoDownload,
  });

  if (status === "loading" || pageLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* LOADOUT NAME BUBBLE - TOP */}
      <LoadoutHeader
        loadoutName={loadoutName}
        isEditingName={isEditingName}
        isLoading={isLoading}
        hasBeenSaved={hasBeenSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        isAuthenticated={status === "authenticated"}
        onNameChange={(name) => {
          setLoadoutName(name);
          setHasUnsavedChanges(true);
        }}
        onEditStart={() => setIsEditingName(true)}
        onEditEnd={() => setIsEditingName(false)}
        onSave={handleSave}
        onDownload={handleDownloadClick}
        onExport={handleExport}
      />

      {/* WEAPON GRID */}
      <WeaponGrid
        loadout={loadout}
        standardImages={standardImages}
        gridRef={gridRef}
        onWeaponClick={setActiveWeapon}
      />

      {/* MESSAGE */}
      {saveMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded ${
            saveMessage.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* SKIN SELECTOR */}
      {activeWeapon && (
        <SkinSelectModal
          weapon={activeWeapon}
          selectedSkinId={loadout[activeWeapon]?.skinId ?? null}
          skins={skins}
          onSelect={selectSkin}
          onClose={() => setActiveWeapon(null)}
        />
      )}

      {/* DOWNLOAD MODAL */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={handleDownloadCancel}
        onConfirm={handleDownloadConfirm}
        previewUrl={downloadPreview}
        loadoutName={loadoutName || "loadout"}
      />
    </div>
  );
}
