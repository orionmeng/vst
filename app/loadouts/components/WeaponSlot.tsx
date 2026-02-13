/**
 * Weapon Slot Component
 * 
 * Displays weapon skin selection in loadout editor.
 * Clickable to open skin selection modal.
 */

/* eslint-disable @next/next/no-img-element */

type Props = {
  weapon: string;
  imageUrl: string | null;
  onClick: () => void;
};

/**
 * Interactive weapon slot button
 * Shows selected skin or "Standard" placeholder
 */
export default function WeaponSlot({ weapon, imageUrl, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 hover:border-red-500 transition text-left"
    >
      <div className="aspect-square bg-neutral-900 rounded flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={weapon}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="text-gray-500 text-xs">Standard</div>
        )}
      </div>

      <p className="mt-2 text-sm text-white">{weapon}</p>
    </button>
  );
}
