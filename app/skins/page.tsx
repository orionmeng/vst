import SkinFilters from "@/app/components/SkinFilters";
import SkinsGrid from "./components/SkinsGrid";

export default function SkinsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white">Skins</h1>

      {/* FILTERS */}
      <SkinFilters />

      {/* GRID WITH INFINITE SCROLL */}
      <SkinsGrid />
    </div>
  );
}
