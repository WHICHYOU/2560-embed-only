// File: web/app/kids/embed-only/page.tsx

"use client";

/**
 * Dedicated embed page for all Kids Showdowns.
 * Shows the universal Yoister embed iframe for category 'kids'.
 * July 2025 — for mobile and desktop use, standalone.
 */

import Link from "next/link";

export default function KidsEmbedOnlyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#f2f9fd] py-8">
      {/* Header */}
      <header className="w-full max-w-lg flex justify-between items-center px-6 py-4 bg-[#0f4c81] text-white rounded-t-xl shadow-md">
        <h1 className="text-lg font-bold">Yoister Kids: All Showdowns</h1>
        <Link href="/kids" className="text-sm underline">
          &larr; Back
        </Link>
      </header>

      {/* Embed */}
      <section className="w-full max-w-lg flex flex-col items-center bg-white rounded-b-xl shadow-lg border-t-0 border-4 border-[#0f4c81] border-solid">
        <iframe
          src="/playground/embed?category=kids"
          title="Yoister Kids Showdown Embed"
          className="w-full h-[600px] rounded-b-xl"
          style={{
            border: "none",
            minHeight: 600,
            background: "white",
          }}
          allowFullScreen
        />
      </section>

      {/* Footer */}
      <footer className="w-full max-w-lg text-center text-xs text-gray-600 mt-8 mb-4">
        © 2025 Yoister ·{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
