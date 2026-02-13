/**
 * Skin Media Display Component
 * 
 * Displays skin image, video, and chroma variants with left column controls.
 * Allows switching between video levels and chroma selection.
 */

"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import SkinActions from "./SkinActions";

type Chroma = {
  uuid: string;
  fullRender: string | null;
  swatch: string | null;
};

type Level = {
  streamedVideo: string | null;
};

interface SkinMediaProps {
  imageUrl: string | null;
  videoUrl: string | null;
  chromas: Chroma[];
  levels: Level[];
  skinId: string;
  initialWishlisted: boolean;
  initialCollected: boolean;
  isAuthenticated: boolean;
}

/**
 * Interactive media gallery for skin preview
 * Manages video/image toggle and level/chroma selection with left sidebar
 */
export default function SkinMedia({
  imageUrl,
  videoUrl,
  chromas,
  levels,
  skinId,
  initialWishlisted,
  initialCollected,
  isAuthenticated,
}: SkinMediaProps) {
  const [activeImage, setActiveImage] = useState<string | null>(imageUrl);
  const [activeVideoLevel, setActiveVideoLevel] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"levels" | "chromas">("levels");

  // Get videos from levels that have streamedVideo
  const videoLevels = levels.filter(level => level.streamedVideo !== null);
  const hasLevels = videoLevels.length > 0;
  const currentVideo = videoLevels[activeVideoLevel]?.streamedVideo || videoUrl;
  
  const validChromas = chromas.filter(c => c.fullRender !== null);
  const hasChromas = validChromas.length > 0;
  
  // Show levels tab if no chromas exist and levels exist
  const showingVideo = activeTab === "levels" && hasLevels;

  // If only one type exists, don't show tabs
  const showTabs = hasLevels && hasChromas;
  const showAnyControls = hasLevels || hasChromas;

  // Convert number to Roman numeral
  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* MAIN MEDIA */}
        <div className="flex-[3] bg-neutral-900 border border-neutral-700 rounded-xl p-6">
          <div className="aspect-video flex items-center justify-center">
            {showingVideo && currentVideo ? (
              <video
                key={currentVideo}
                src={currentVideo}
                autoPlay
                loop
                muted
                className="w-full h-full rounded object-contain"
              />
            ) : (
              activeImage && (
                <img
                  src={activeImage}
                  alt="Skin Preview"
                  className="max-w-[75%] max-h-[75%] object-contain"
                />
              )
            )}
          </div>
        </div>

        {/* CONTROLS SIDEBAR */}
        <div className="flex-1 flex flex-col">
          {showAnyControls && (
            <>
              {/* TOGGLE */}
              {showTabs && (
                <div className="space-y-3 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Toggle
                  </h3>
                  <button
                    onClick={() => setActiveTab(activeTab === "levels" ? "chromas" : "levels")}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                  >
                    Showing {activeTab === "levels" ? "Upgrades" : "Variants"}
                  </button>
                </div>
              )}

              {/* LEVEL SELECTION */}
              {activeTab === "levels" && hasLevels && (
                <div className="space-y-3 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {showTabs ? "Select Level" : "Upgrade Levels"}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {videoLevels.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveVideoLevel(index)}
                        className={`aspect-square rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                          activeVideoLevel === index && showingVideo
                            ? "bg-red-600 text-white ring-2 ring-red-400"
                            : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                        }`}
                      >
                        {toRoman(index + 1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CHROMA SELECTION */}
              {activeTab === "chromas" && hasChromas && (
                <div className="space-y-3 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {showTabs ? "Select Chroma" : "Skin Variants"}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {validChromas.map((chroma, index) => (
                      <button
                        key={chroma.uuid}
                        onClick={() => {
                          setActiveImage(chroma.fullRender);
                        }}
                        className={`aspect-square border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                          activeImage === chroma.fullRender && activeTab === "chromas"
                            ? "border-red-500 ring-2 ring-red-400"
                            : "border-neutral-700 hover:border-gray-500"
                        }`}
                      >
                        {chroma.swatch ? (
                          <img
                            src={chroma.swatch}
                            alt={`Chroma ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={chroma.fullRender!}
                            alt={`Chroma ${index + 1}`}
                            className="w-full h-full object-contain p-1 bg-neutral-800"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* SPACER */}
          <div className="flex-grow"></div>

          {/* ACTIONS */}
          <div className={`space-y-3 mb-6 ${showAnyControls ? "mt-4 pt-4 border-t border-neutral-700" : ""}`}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</h3>
            <SkinActions
              skinId={skinId}
              initialWishlisted={initialWishlisted}
              initialCollected={initialCollected}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
