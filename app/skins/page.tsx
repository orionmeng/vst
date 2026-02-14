import { Suspense } from "react";
import SkinFilters from "@/app/components/SkinFilters";
import SkinsGrid from "./components/SkinsGrid";

export const dynamic = 'force-dynamic';

export default function SkinsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white">Skins</h1>

      {/* FILTERS */}
      <Suspense fallback={<div className="h-20 animate-pulse bg-neutral-800 rounded" />}>
        <SkinFilters />
      </Suspense>

      {/* GRID WITH INFINITE SCROLL */}
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-xl p-4 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded mb-3" />
              <div className="h-4 bg-neutral-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      }>
        <SkinsGrid />
      </Suspense>
    </div>
  );
}
