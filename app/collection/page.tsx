import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import SkinFilters from "@/app/components/SkinFilters";
import CollectionGrid from "./components/CollectionGrid";

export default async function CollectionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        My Collection
      </h1>

      {/* FILTERS */}
      <SkinFilters />

      {/* GRID WITH INFINITE SCROLL */}
      <CollectionGrid />
    </div>
  );
}
