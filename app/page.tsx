import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="px-6 py-16 max-w-6xl mx-auto space-y-20">
      {/* HERO SECTION */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,50,50,0.3)]">
          Track Your Valorant Skins
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Browse Valorant skins, manage your personal collection, keep track of your wishlist,
          and create your own loadouts!
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/skins"
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded font-medium transition"
          >
            Browse Skins
          </Link>
          <Link
            href="/about"
            className="border border-red-500 text-red-400 hover:bg-red-600/20 px-6 py-3 rounded font-medium transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid sm:grid-cols-3 gap-8">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Full Skin Database</h3>
          <p className="text-gray-400">
            Explore all skins sorted by weapon.
          </p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Personal Collection</h3>
          <p className="text-gray-400">
            Track which skins you own and which skins you want.
          </p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-2">Loadouts</h3>
          <p className="text-gray-400">
            Craft and customize your own loadouts to see how skins look together.
          </p>
        </div>
      </section>
    </div>
  );
}
