"use client";
/**
 * File: components/ui/EmbedContainer.tsx
 * Date: July 26, 2025
 * Purpose: Visual wrapper around Yoister showdown iframe embed
 * Context: Used in Yoister Kids site to enhance the UX beyond the raw embed
 *
 * ❓ Why this exists:
 * The actual showdown content (comparison logic, images, votes) is embedded via
 * <iframe> from the Yoister platform. This component does *not* modify that content,
 * but surrounds it with:
 *   - UI structure and visual framing
 *   - Optional CTA buttons and interactive hints
 *   - Future expansion points (e.g. feedback, reactions, local storage, links)
 *
 * ✅ Current Features:
 * - Title and tagline text
 * - Responsive framed <iframe> for Yoister showdown embed
 * - “I picked mine!” CTA button (no backend yet)
 * - Optional expandable description (educational context)
 * - Soft background and footer for polished layout
 *
 * 🚫 No external data or auth used (yet) — this component is client-only and state-free.
 *
 * 💡 Future upgrades may include:
 *   - Emoji-based feedback
 *   - Story prompts / text areas
 *   - Offline localStorage voting
 *   - Light/dark themes or user preferences
 *   - Admin-controlled overlay UI
 */

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EmbedContainer({
  title = "Today's Matchup!",
  tagline = "Which one do YOU pick?",
  iframeSrc = "/embed/compare?category=kids",
}: {
  title?: string;
  tagline?: string;
  iframeSrc?: string;
}) {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-yellow-300 p-6 relative">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-rose-600 mb-1">{title}</h1>
          <p className="text-lg text-zinc-700">{tagline}</p>
        </div>

        {/* 👇 IFRAME */}
        <div className="mt-6 overflow-hidden rounded-xl border border-rose-200 shadow-inner">
          <iframe
            src={iframeSrc}
            className="w-full aspect-[4/3] rounded-xl"
            allow="clipboard-write"
          />
        </div>

        {/* 👇 Optional Interactive Features */}
        <div className="mt-6 flex flex-col gap-4 items-center">
          <button className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded-full">
            I picked mine!
          </button>

          <div className="text-sm text-zinc-500 italic">
            Your choice is not saved yet.
          </div>

          <details className="w-full mt-4 cursor-pointer bg-yellow-100 text-yellow-800 p-3 rounded-md">
            <summary className="font-semibold">What's this all about?</summary>
            <div className="mt-2 text-sm">
              This page helps you explore fun choices using Yoister. You can
              imagine, discuss, and learn — no signup needed.
            </div>
          </details>
        </div>
      </div>

      {/* Footer or logo */}
      <footer className="mt-10 text-sm text-zinc-400">
        © {new Date().getFullYear()} Yoister Kids English
      </footer>
    </div>
  );
}
