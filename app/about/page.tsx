import AboutBubbles from "./components/AboutBubbles";

export default function AboutPage() {
  const aboutBubbles = [
    { id: 1, 
      title: "University of Wisconsin", 
      image: "/images/uw-madison.jpg", 
      link: "https://www.wisc.edu/" },
    { id: 2, 
      title: "VALORANT", 
      image: "/images/valorant_logo.jpg", 
      link: "https://tracker.gg/valorant/profile/riot/onion%23mango/overview?platform=pc&playlist=competitive" },
    { id: 3, 
      title: "Teamfight Tactics", 
      image: "/images/tft_logo.jpg", 
      link: "https://lolchess.gg/profile/na/onion-mango/set9.5" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">About</h1>

      {/* PURPOSE SECTION */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Website Purpose</h2>
        <p className="text-gray-300 leading-relaxed">
          Valorant Skin Tracker is a personal project designed to help users organize and manage their Valorant skin collection.
          The site allows users to create custom loadouts, track owned skins, and maintain a wishlist of desired items.
        </p>
      </section>

      {/* ABOUT ME SECTION */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-8">Developer Background</h2>
        <AboutBubbles bubbles={aboutBubbles} />
      </section>
    </div>
  );
}
