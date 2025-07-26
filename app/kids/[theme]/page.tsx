/**
 * File: app/kids/[theme]/page.tsx
 * Date: July 26, 2025
 * Purpose: Dynamic topic embed page for kids vocabulary themes
 * Notes:
 * - Uses URL param (e.g. /kids/verbs)
 * - Loads correct Yoister embed URL via local static map
 * - Returns 404 if unknown theme
 */

import { notFound } from "next/navigation";
import { topicMap } from "../topics";
import Link from "next/link";

export default function KidsThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const topic = topicMap[params.theme];
  if (!topic) return notFound();

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#f2f9fd]">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-[#0f4c81] text-white">
        <h1 className="text-2xl font-bold">Yoister Kids: {topic.label}</h1>
        <Link href="/kids" className="text-sm underline">
          ← Back
        </Link>
      </header>

      {/* Embedded showdown for this theme */}
      <iframe
        src={topic.embedUrl}
        className="w-full max-w-5xl h-[600px] mt-10 border-4 border-[#0f4c81] rounded-xl bg-white shadow-lg"
        allowFullScreen
      />

      {/* Footer */}
      <footer className="w-full text-center text-sm text-gray-600 mt-10 mb-6">
        &copy; 2025 Yoister ·{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
