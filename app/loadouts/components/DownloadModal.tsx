/**
 * Download Preview Modal Component
 * 
 * Shows loadout image preview before downloading.
 * Allows user to confirm or cancel download.
 */

/* eslint-disable @next/next/no-img-element */
"use client";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  previewUrl: string | null;
  loadoutName: string;
}

/**
 * Modal for previewing loadout before download
 * Shows generated image and download confirmation
 */
export default function DownloadModal({
  isOpen,
  onClose,
  onConfirm,
  previewUrl,
  loadoutName,
}: DownloadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Download Preview
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-neutral-800">
          {previewUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={previewUrl}
                alt={`${loadoutName} preview`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Generating preview...</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-neutral-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition cursor-pointer text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!previewUrl}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-sm font-semibold"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
