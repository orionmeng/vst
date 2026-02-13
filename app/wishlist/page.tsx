import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SkinFilters from "@/app/components/SkinFilters";
import WishlistGrid from "./components/WishlistGrid";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        My Wishlist
      </h1>

      {/* FILTERS */}
      <SkinFilters />

      {/* GRID WITH INFINITE SCROLL */}
      <WishlistGrid />
    </div>
  );
}
