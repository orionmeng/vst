/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Loadout Import Modal Component
 * 
 * Allows users to import loadout configurations from JSON files or text.
 * Validates format and creates new loadout via API.
 */

"use client";

import { useState, useRef } from "react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: LoadoutImportData) => Promise<void>;
}

export interface LoadoutImportData {
  name: string;
  icon?: string | null;
  entries: Record<string, string | null>;
}

/**
 * Modal for importing loadout from JSON file or pasted text
 * Validates JSON structure before import
 */
export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      setError("");
    };
    reader.readAsText(file);
  };

  const validateAndParse = (text: string): LoadoutImportData | null => {
    try {
      const data = JSON.parse(text);

      // Validate structure
      if (!data.name || typeof data.name !== "string") {
        setError("Invalid format: missing or invalid 'name' field");
        return null;
      }

      if (!data.entries || typeof data.entries !== "object") {
        setError("Invalid format: missing or invalid 'entries' field");
        return null;
      }

      // Validate entries are weapon->skinId mappings
      for (const [weapon, skinId] of Object.entries(data.entries)) {
        if (skinId !== null && typeof skinId !== "string") {
          setError(`Invalid format: entry for ${weapon} must be a string or null`);
          return null;
        }
      }

      // Only include icon if it's a non-empty string
      const result: LoadoutImportData = {
        name: data.name,
        entries: data.entries,
      };

      if (data.icon && typeof data.icon === "string" && data.icon.trim()) {
        result.icon = data.icon;
      }

      return result;
    } catch (err) {
      setError("Invalid JSON format");
      return null;
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      setError("Please provide loadout data");
      return;
    }

    const data = validateAndParse(importText);
    if (!data) return;

    setIsImporting(true);
    setError("");

    try {
      await onImport(data);
      setImportText("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import loadout");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setImportText("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Import Loadout</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload JSON File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div className="text-center text-gray-500 text-sm">OR</div>

          {/* PASTE TEXT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste JSON Data
            </label>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setError("");
              }}
              placeholder='{"name":"My Loadout","entries":{"Classic":"abc-123",...}}'
              className="w-full h-48 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* INFO */}
          <div className="bg-neutral-800 border border-neutral-700 rounded px-4 py-3 text-xs text-gray-400">
            <p className="font-semibold text-gray-300 mb-1">Expected Format:</p>
            <pre className="whitespace-pre-wrap">
{`{
  "name": "Loadout Name",
  "icon": "https://..." (optional),
  "entries": {
    "Classic": "skin-id-here",
    "Vandal": "another-id",
    ...
  }
}`}
            </pre>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-neutral-700 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition cursor-pointer text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting || !importText.trim()}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-semibold"
          >
            {isImporting ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
