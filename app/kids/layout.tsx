/**
 * File: app/kids/layout.tsx
 * Date: July 26, 2025
 * Purpose: Scoped layout for all /kids routes (visual + font).
 * Notes:
 * - Applies background, font, text color.
 * - Imports Tailwind/global CSS.
 * - Sets scoped metadata for SEO.
 * - Wraps every page under /kids/*.
 */

import "../../globals.css"; // ✅ Tailwind and base styles

export const metadata = {
  title: "Yoister Kids · Learn English Playfully",
  description: "Playful English learning powered by real emotional choices.",
};

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2f9fd] text-[#222] font-sans">{children}</body>
    </html>
  );
}
