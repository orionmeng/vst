/**
 * About Page Bubbles Component
 * 
 * Grid of image bubbles with titles.
 * Supports optional links for clickable bubbles.
 */

"use client";

import Image from "next/image";

interface Bubble {
  id: number;
  title: string;
  image: string;
  link?: string;
}

interface AboutBubblesProps {
  bubbles: Bubble[];
}

/**
 * 3-column grid of image bubbles
 * Hover effect scales images and highlights border
 */
export default function AboutBubbles({ bubbles }: AboutBubblesProps) {

  return (
    <div className="grid grid-cols-3 gap-6">
      {bubbles.map((bubble) => {
        const Component = bubble.link ? 'a' : 'div';
        const props = bubble.link ? { href: bubble.link, target: '_blank', rel: 'noopener noreferrer' } : {};
        return (
          <Component key={bubble.id} className="group cursor-pointer" {...props}>
            <div className="relative w-full aspect-square bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-red-500 transition">
            {/* Image */}
            <Image
              src={bubble.image}
              alt={bubble.title}
              fill
              sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc(50vw - 24px), calc(33vw - 16px)"
              priority={bubble.id === 1}
              quality={100}
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Title strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-700 px-3 py-2">
              <p className="text-sm font-semibold text-white truncate">{bubble.title}</p>
            </div>
          </div>
          </Component>
        );
      })}
    </div>
  );
}
