/**
 * Application Footer Component
 * 
 * Displays copyright and technology credits.
 */

/**
 * Simple footer with copyright and tech stack links
 */
export default function Footer() {
  return (
    <footer className="bg-neutral-800 border-t border-neutral-700 text-gray-400 text-sm mt-0">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Valorant Skin Tracker</p>
        <p>
          Join the{" "}
          <a
            href="https://discord.gg/f9uVXkuhrz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 hover:underline"
          >
            Discord
          </a>
          {" "}to report bugs, suggest features, or share your loadouts!
        </p>
        <p className="text-gray-500">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            className="text-gray-300 hover:text-white"
          >
            Next.js
          </a>{" "}
          &{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            className="text-gray-300 hover:text-white"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </footer>
  );
}
