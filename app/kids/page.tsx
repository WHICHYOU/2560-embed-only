/**
 * File: app/kids/page.tsx
 * FINAL CLIENT DATA LOADING — PUBLIC FOLDER FETCH
 *
 * - Loads showdown data from /data/yoister_kids_showdowns.json (public directory, HTTP fetch)
 * - All session/voting/like/share logic as before
 * - Bulletproof for client-side Next.js, fully mobile first, no backend dependency
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlipCard } from "@/components/FlipCard";
import { UserCircle2, Heart, Share2, X } from "lucide-react";

type Showdown = {
  id: string;
  title?: string;
  item_a: {
    id: string;
    name: string;
    slug: string;
    label: string;
    image_url: string;
  };
  item_b: {
    id: string;
    name: string;
    slug: string;
    label: string;
    image_url: string;
  };
};

const ALL_COUNTS = [3, 5, 10, 20];

function getRandomShowdowns(all: Showdown[], n: number): Showdown[] {
  // Shuffle and return top n
  const pool = [...all];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export default function KidsHomePage() {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionCount, setSessionCount] = useState<number>(10);
  const [sessionActive, setSessionActive] = useState(false);
  const [showdowns, setShowdowns] = useState<Showdown[]>([]);
  const [allShowdowns, setAllShowdowns] = useState<Showdown[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [votes, setVotes] = useState<{ [showdownId: string]: "A" | "B" }>({});
  const [likes, setLikes] = useState<{
    [showdownId: string]: { A: boolean; B: boolean };
  }>({});
  const [shareModal, setShareModal] = useState<{
    showdownId: string;
    side: "A" | "B";
  } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/yoister_kids_showdowns.json")
      .then((res) => res.json())
      .then((data) => {
        setAllShowdowns(
          Array.isArray(data)
            ? data.filter(
                (s) =>
                  s?.item_a?.image_url &&
                  s?.item_b?.image_url &&
                  s?.item_a?.name &&
                  s?.item_b?.name
              )
            : []
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      setLikes(JSON.parse(localStorage.getItem("kids_likes") || "{}"));
      setVotes(JSON.parse(localStorage.getItem("kids_votes") || "{}"));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("kids_likes", JSON.stringify(likes));
  }, [likes]);
  useEffect(() => {
    localStorage.setItem("kids_votes", JSON.stringify(votes));
  }, [votes]);

  const startSession = (n: number) => {
    const chosen = getRandomShowdowns(allShowdowns, n);
    setShowdowns(chosen);
    setSessionCount(n);
    setCurrentIdx(0);
    setSessionActive(true);
    setSessionOpen(false);
    setVotes({});
    setLikes({});
  };

  const handleVote = (side: "A" | "B") => {
    if (!sessionActive || !showdowns.length) return;
    const currId = showdowns[currentIdx]?.id;
    if (!currId || votes[currId]) return;
    setVotes((prev) => ({ ...prev, [currId]: side }));
    setTimeout(() => {
      if (currentIdx + 1 < showdowns.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setCurrentIdx(showdowns.length); // triggers summary
      }
    }, 350);
  };

  const handleLike = (showdownId: string, side: "A" | "B") => {
    setLikes((prev) => ({
      ...prev,
      [showdownId]: {
        ...(prev[showdownId] || { A: false, B: false }),
        [side]: !(prev[showdownId] || {})[side],
      },
    }));
  };

  const openShare = (showdownId: string, side: "A" | "B") =>
    setShareModal({ showdownId, side });
  const closeShare = () => setShareModal(null);

  const handleReset = () => {
    setResetConfirm(false);
    setSessionActive(false);
    setVotes({});
    setShowdowns([]);
    setCurrentIdx(0);
  };

  const progress = sessionActive
    ? `${Math.min(Object.keys(votes).length, showdowns.length)} / ${
        showdowns.length || sessionCount
      } completed`
    : "0 / 10 completed";

  const demoCards = [
    {
      label: "Pancakes",
      color: "#0f4c81",
      img: "/compare/kids99.jpg",
      desc: "Soft, fluffy, syrupy... yum!",
      arrowSide: "right" as "right",
    },
    {
      label: "Waffles",
      color: "#ff7b00",
      img: "/compare/kids100.jpg",
      desc: "Crispy squares, sweet pockets!",
      arrowSide: "left" as "left",
    },
  ];

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </main>
    );
  }

  // CARD SECTION
  let cardSection = null;

  if (
    sessionActive &&
    showdowns.length &&
    currentIdx < showdowns.length &&
    showdowns[currentIdx]
  ) {
    const showdown = showdowns[currentIdx];
    const voted = votes[showdown.id];

    cardSection = (
      <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
        {/* Card A */}
        <FlipCard
          className="w-[260px] h-[360px]"
          panelClassName="rounded-xl overflow-hidden"
          arrowSide="right"
          front={
            <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
              <Image
                src={showdown.item_a.image_url}
                alt={showdown.item_a.name}
                fill
                sizes="(max-width: 768px) 90vw, 240px"
                className="object-cover rounded-xl"
                priority
              />
              <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
                <p className="text-[#0f4c81] font-bold text-lg">
                  {showdown.item_a.name}
                </p>
                <button
                  className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition"
                  disabled={!!voted}
                  onClick={() => handleVote("A")}
                >
                  Vote!
                </button>
                <span className="ml-2 inline-flex items-center">
                  <button
                    onClick={() => handleLike(showdown.id, "A")}
                    className="mr-1"
                    aria-label="Like"
                  >
                    <Heart
                      fill={likes[showdown.id]?.A ? "#f43f5e" : "none"}
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => openShare(showdown.id, "A")}
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </span>
              </div>
            </div>
          }
          back={
            <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4 rounded-xl shadow-lg">
              <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
                {showdown.item_a.label || ""}
              </p>
              <button
                className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition"
                disabled={!!voted}
                onClick={() => handleVote("A")}
              >
                Vote!
              </button>
            </div>
          }
        />
        {/* Card B */}
        <FlipCard
          className="w-[260px] h-[360px]"
          panelClassName="rounded-xl overflow-hidden"
          arrowSide="left"
          front={
            <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
              <Image
                src={showdown.item_b.image_url}
                alt={showdown.item_b.name}
                fill
                sizes="(max-width: 768px) 90vw, 240px"
                className="object-cover rounded-xl"
                priority
              />
              <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
                <p className="text-[#ff7b00] font-bold text-lg">
                  {showdown.item_b.name}
                </p>
                <button
                  className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition"
                  disabled={!!voted}
                  onClick={() => handleVote("B")}
                >
                  Vote!
                </button>
                <span className="ml-2 inline-flex items-center">
                  <button
                    onClick={() => handleLike(showdown.id, "B")}
                    className="mr-1"
                    aria-label="Like"
                  >
                    <Heart
                      fill={likes[showdown.id]?.B ? "#f43f5e" : "none"}
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => openShare(showdown.id, "B")}
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </span>
              </div>
            </div>
          }
          back={
            <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4 rounded-xl shadow-lg">
              <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
                {showdown.item_b.label || ""}
              </p>
              <button
                className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition"
                disabled={!!voted}
                onClick={() => handleVote("B")}
              >
                Vote!
              </button>
            </div>
          }
        />
      </section>
    );
  } else if (
    sessionActive &&
    showdowns.length &&
    currentIdx >= showdowns.length
  ) {
    cardSection = (
      <section className="flex flex-col items-center mt-8 w-full max-w-xl">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-2">All done!</h2>
          <p className="text-lg mb-4">
            You finished {showdowns.length} showdowns!
          </p>
          <div className="flex flex-col gap-3 mb-4">
            {showdowns.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-2 justify-between bg-[#f8fafc] rounded-lg px-3 py-2"
              >
                <span className="font-semibold">
                  {s.item_a.name} vs {s.item_b.name}
                </span>
                <span>
                  <Heart
                    fill={likes[s.id]?.A || likes[s.id]?.B ? "#f43f5e" : "none"}
                    className="inline w-4 h-4 mr-1"
                  />
                  <button
                    className="ml-1"
                    aria-label="Share"
                    onClick={() => openShare(s.id, votes[s.id] || "A")}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </span>
                <span>
                  {votes[s.id] === "A" ? s.item_a.name : s.item_b.name}
                </span>
              </div>
            ))}
          </div>
          <button
            className="mt-2 px-6 py-2 bg-[#0f4c81] text-white rounded-full font-bold hover:scale-105 transition"
            onClick={() => setSessionActive(false)}
          >
            Play Again
          </button>
        </div>
      </section>
    );
  } else {
    cardSection = (
      <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
        {demoCards.map((c, i) => (
          <FlipCard
            key={i}
            className="w-[260px] h-[360px]"
            panelClassName="rounded-xl overflow-hidden"
            arrowSide={c.arrowSide}
            front={
              <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  sizes="(max-width: 768px) 90vw, 240px"
                  className="object-cover rounded-xl"
                  priority={i === 0}
                />
                <div
                  className="relative z-10 bg-white/90 w-full text-center py-3 px-2"
                  style={{ borderTop: `2px solid ${c.color}` }}
                >
                  <p className="font-bold text-lg" style={{ color: c.color }}>
                    {c.label}
                  </p>
                  <button
                    className="mt-1 px-4 py-1 text-white text-sm rounded-full hover:scale-105 transition"
                    style={{ background: c.color }}
                  >
                    Vote!
                  </button>
                </div>
              </div>
            }
            back={
              <div
                className="w-full h-full flex flex-col justify-end items-center"
                style={{ background: i === 0 ? "#e6f0f6" : "#fff4e5" }}
              >
                <p
                  className="text-center font-semibold text-base mt-4"
                  style={{ color: c.color }}
                >
                  {c.desc}
                </p>
                <button
                  className="mt-auto px-4 py-2 text-white text-sm rounded-full hover:scale-105 transition"
                  style={{ background: c.color }}
                >
                  Vote!
                </button>
              </div>
            }
          />
        ))}
      </section>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f2f9fd] text-[#222] flex flex-col items-center py-6 px-4">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between px-6 py-4 bg-[#0f4c81] text-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold">Yoister Kids</h1>
        <div className="relative group">
          <button className="text-sm underline hover:opacity-80 flex items-center gap-1">
            <UserCircle2 className="w-5 h-5" /> For Grown-Ups
          </button>
          <div className="hidden group-hover:block absolute right-0 mt-2 bg-white text-[#0f4c81] text-sm shadow-lg rounded-md py-2 px-4 z-50">
            <ul className="space-y-1">
              <li>Sign up</li>
              <li>Login</li>
              <li>Profile</li>
              <li>Settings</li>
            </ul>
          </div>
        </div>
      </header>

      {/* Start Now sticky button */}
      <div className="w-full max-w-md flex justify-center mt-4 mb-2">
        <button
          className="text-base font-bold bg-white text-[#0f4c81] px-5 py-2 rounded-full shadow hover:bg-blue-100 transition border"
          onClick={() => {
            if (sessionActive) setResetConfirm(true);
            else setSessionOpen((v) => !v);
          }}
        >
          Start Now
        </button>
        {sessionOpen && (
          <div className="absolute top-28 left-0 right-0 mx-auto bg-white rounded-xl shadow-lg p-5 flex flex-col items-center border z-50 max-w-xs">
            <h3 className="mb-3 text-lg font-bold text-[#0f4c81]">
              How many showdowns?
            </h3>
            <div className="flex gap-3 mb-2">
              {ALL_COUNTS.map((n) => (
                <button
                  key={n}
                  className="px-5 py-2 bg-blue-50 rounded-lg border text-[#0f4c81] font-semibold hover:bg-blue-100 transition"
                  onClick={() => startSession(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              className="text-xs text-[#999] mt-2 underline"
              onClick={() => setSessionOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}
        {resetConfirm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <p className="mb-4 text-lg text-[#0f4c81] font-semibold">
                This will reset your current session.
                <br />
                Are you sure?
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 bg-[#0f4c81] text-white rounded-full font-bold hover:scale-105 transition"
                  onClick={handleReset}
                >
                  Yes, reset
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-[#0f4c81] rounded-full font-bold hover:bg-gray-300 transition"
                  onClick={() => setResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md text-center text-base font-semibold mt-2 mb-1">
        <span>{progress}</span>
      </div>

      {cardSection}

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={closeShare}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-3">Share this showdown</h3>
            <input
              className="w-full mb-3 px-2 py-1 border rounded bg-gray-50 text-sm"
              value={typeof window !== "undefined" ? window.location.href : ""}
              readOnly
              onFocus={(e) => e.target.select()}
            />
            <button
              className="mb-3 px-4 py-1 bg-[#0f4c81] text-white rounded-full font-bold hover:bg-blue-700 transition"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                closeShare();
              }}
            >
              Copy Link
            </button>
            <div className="flex gap-3">
              <span className="opacity-50">
                <Share2 className="w-6 h-6" />
              </span>
              <span className="opacity-50">
                <Share2 className="w-6 h-6" />
              </span>
              <span className="opacity-50">
                <Share2 className="w-6 h-6" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Nav */}
      <nav className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          ["Happy vs Sad", "/kids/happy"],
          ["Action Verbs", "/kids/verbs"],
          ["Animals", "/kids/animals"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-sm px-4 py-2 bg-white border border-[#0f4c81] rounded-full text-[#0f4c81] hover:bg-[#e6f0f6] transition"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Learn More */}
      <details className="mt-6 text-sm bg-blue-50 border-l-4 border-[#0f4c81] p-4 rounded-md text-zinc-700 cursor-pointer max-w-xl w-full">
        <summary className="font-medium text-[#0f4c81]">
          What’s this all about?
        </summary>
        <div className="mt-2 text-left">
          Yoister helps you learn English by choosing between fun, vivid ideas —
          no tests, just play!
        </div>
      </details>

      {/* Footer */}
      <footer className="w-full mt-12 text-center text-sm text-gray-500">
        &copy; 2025 Yoister ·{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}

// "use client";
// /**
//  * File: app/kids/page.tsx
//  * Yoister Kids — "Showdown" Voting Experience (Embed Container)
//  *
//  * FINAL LAYOUT LOCKED — (PLAN B, July 27, 2025)
//  *
//  * 🔒 LAYOUT IS BENCHMARKED TO THE ORIGINAL:
//  *   - Header bar: "Yoister Kids" and user icon always in one line
//  *   - Two FlipCards (A/B) horizontally, always using original card and arrow layout
//  *   - Vote button, card overlays, arrows, and card flipping are untouched and pixel-identical to original
//  *   - Card heights, padding, and arrangement match the first working Yoister Kids design
//  *   - All category and footer sections, and card container sizing, are not changed
//  *
//  * ✅ **Client-Side Voting & Engagement**
//  *   - Voting is local-only (votes stored in localStorage per session)
//  *   - Like and Share features are local per showdown card (not global, not backend)
//  *   - "Start Now" floating button above cards (NEVER inside the header)
//  *   - Progress bar always visible ("0/10 completed" etc.)
//  *   - "How many showdowns?" dropdown on Start Now button (with reset confirmation if mid-session)
//  *   - Voting flow and card order is randomized per session
//  *   - When voting is finished, a summary view is shown (also local-only)
//  *   - Category nav and "What’s this all about?" always at the bottom, never changed
//  *
//  * 🚫 **What is NOT changed:**
//  *   - FlipCard component usage and props
//  *   - Card size, flipping effect, vote button position, arrow direction
//  *   - Original header, card, and footer markup
//  *   - Image sizes, aspect ratios, and card overlays
//  *   - Any unrelated logic, state, or layout
//  *
//  * ❗All code changes are surgical, respecting Yoister locked UX and style.
//  *   — Voting, like, and share are per-session and per-device only.
//  *   — All changes are reversible: remove voting logic to return to original visual only.
//  *
//  * If you need to update any behavior, you must preserve the locked markup and card layout as above.
//  */

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FlipCard } from "@/components/FlipCard";
// import { UserCircle2, Heart, Share2, X } from "lucide-react";
// import showdownsData from "@/data/presets/yoister_kids_showdowns.json";

// type Showdown = {
//   id: string;
//   title?: string;
//   itemA: { name: string; image: string };
//   itemB: { name: string; image: string };
//   descriptionA?: string;
//   descriptionB?: string;
// };

// const ALL_COUNTS = [3, 5, 10, 20];

// function normalizeShowdown(raw: any): Showdown {
//   return {
//     id: raw.id,
//     title: raw.title,
//     itemA: {
//       name: raw.item_a.name,
//       image: raw.item_a.image_url,
//     },
//     itemB: {
//       name: raw.item_b.name,
//       image: raw.item_b.image_url,
//     },
//     descriptionA: raw.item_a.label,
//     descriptionB: raw.item_b.label,
//   };
// }

// function getRandomShowdowns(all: Showdown[], n: number) {
//   const pool = [...all];
//   const out: Showdown[] = [];
//   while (pool.length && out.length < n) {
//     const idx = Math.floor(Math.random() * pool.length);
//     out.push(pool.splice(idx, 1)[0]);
//   }
//   return out;
// }

// export default function KidsHomePage() {
//   // Voting state
//   const [sessionOpen, setSessionOpen] = useState(false);
//   const [sessionCount, setSessionCount] = useState<number>(10);
//   const [sessionActive, setSessionActive] = useState(false);
//   const [showdowns, setShowdowns] = useState<Showdown[]>([]);
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [votes, setVotes] = useState<{ [showdownId: string]: "A" | "B" }>({});
//   const [likes, setLikes] = useState<{
//     [showdownId: string]: { A: boolean; B: boolean };
//   }>({});
//   const [shareModal, setShareModal] = useState<{
//     showdownId: string;
//     side: "A" | "B";
//   } | null>(null);
//   const [resetConfirm, setResetConfirm] = useState(false);

//   useEffect(() => {
//     try {
//       setLikes(JSON.parse(localStorage.getItem("kids_likes") || "{}"));
//       setVotes(JSON.parse(localStorage.getItem("kids_votes") || "{}"));
//     } catch {}
//   }, []);
//   useEffect(() => {
//     localStorage.setItem("kids_likes", JSON.stringify(likes));
//   }, [likes]);
//   useEffect(() => {
//     localStorage.setItem("kids_votes", JSON.stringify(votes));
//   }, [votes]);

//   const startSession = (n: number) => {
//     const allShowdowns = (showdownsData as any[]).map(normalizeShowdown);
//     setShowdowns(getRandomShowdowns(allShowdowns, n));
//     setSessionCount(n);
//     setCurrentIdx(0);
//     setSessionActive(true);
//     setSessionOpen(false);
//     setVotes({});
//   };

//   const handleVote = (side: "A" | "B") => {
//     if (!sessionActive) return;
//     const currId = showdowns[currentIdx]?.id;
//     if (!currId || votes[currId]) return;
//     setVotes((prev) => ({ ...prev, [currId]: side }));
//     setTimeout(() => {
//       if (currentIdx + 1 < sessionCount) setCurrentIdx(currentIdx + 1);
//     }, 400);
//   };

//   const handleLike = (showdownId: string, side: "A" | "B") => {
//     setLikes((prev) => ({
//       ...prev,
//       [showdownId]: {
//         ...(prev[showdownId] || { A: false, B: false }),
//         [side]: !(prev[showdownId] || {})[side],
//       },
//     }));
//   };

//   const openShare = (showdownId: string, side: "A" | "B") =>
//     setShareModal({ showdownId, side });
//   const closeShare = () => setShareModal(null);

//   const handleReset = () => {
//     setResetConfirm(false);
//     setSessionActive(false);
//     setVotes({});
//     setShowdowns([]);
//     setCurrentIdx(0);
//   };

//   const progress = sessionActive
//     ? `${Object.keys(votes).length} / ${sessionCount} completed`
//     : "0 / 10 completed";

//   // ---- Render ----

//   let cardSection = null;

//   if (sessionActive && showdowns.length && currentIdx < showdowns.length) {
//     const showdown = showdowns[currentIdx];
//     const voted = votes[showdown.id];

//     cardSection = (
//       <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
//         {/* A */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="right"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src={showdown.itemA.image}
//                 alt={showdown.itemA.name}
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#0f4c81] font-bold text-lg">
//                   {showdown.itemA.name}
//                 </p>
//                 <button
//                   className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition"
//                   disabled={!!voted}
//                   onClick={() => handleVote("A")}
//                 >
//                   Vote!
//                 </button>
//                 <span className="ml-2 inline-flex items-center">
//                   <button
//                     onClick={() => handleLike(showdown.id, "A")}
//                     className="mr-1"
//                     aria-label="Like"
//                   >
//                     <Heart
//                       fill={likes[showdown.id]?.A ? "#f43f5e" : "none"}
//                       className="w-5 h-5"
//                     />
//                   </button>
//                   <button
//                     onClick={() => openShare(showdown.id, "A")}
//                     aria-label="Share"
//                   >
//                     <Share2 className="w-5 h-5" />
//                   </button>
//                 </span>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4 rounded-xl shadow-lg">
//               <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
//                 {showdown.descriptionA || ""}
//               </p>
//               <button
//                 className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition"
//                 disabled={!!voted}
//                 onClick={() => handleVote("A")}
//               >
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//         {/* B */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="left"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src={showdown.itemB.image}
//                 alt={showdown.itemB.name}
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#ff7b00] font-bold text-lg">
//                   {showdown.itemB.name}
//                 </p>
//                 <button
//                   className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition"
//                   disabled={!!voted}
//                   onClick={() => handleVote("B")}
//                 >
//                   Vote!
//                 </button>
//                 <span className="ml-2 inline-flex items-center">
//                   <button
//                     onClick={() => handleLike(showdown.id, "B")}
//                     className="mr-1"
//                     aria-label="Like"
//                   >
//                     <Heart
//                       fill={likes[showdown.id]?.B ? "#f43f5e" : "none"}
//                       className="w-5 h-5"
//                     />
//                   </button>
//                   <button
//                     onClick={() => openShare(showdown.id, "B")}
//                     aria-label="Share"
//                   >
//                     <Share2 className="w-5 h-5" />
//                   </button>
//                 </span>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4 rounded-xl shadow-lg">
//               <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
//                 {showdown.descriptionB || ""}
//               </p>
//               <button
//                 className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition"
//                 disabled={!!voted}
//                 onClick={() => handleVote("B")}
//               >
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//       </section>
//     );
//   } else if (
//     sessionActive &&
//     showdowns.length &&
//     currentIdx >= showdowns.length
//   ) {
//     // Post voting summary
//     cardSection = (
//       <section className="flex flex-col items-center mt-8 w-full max-w-xl">
//         <div className="bg-white p-6 rounded-xl shadow-xl text-center">
//           <h2 className="text-2xl font-bold mb-2">All done!</h2>
//           <p className="text-lg mb-4">You finished {sessionCount} showdowns!</p>
//           <div className="flex flex-col gap-3 mb-4">
//             {showdowns.map((s, i) => (
//               <div
//                 key={s.id}
//                 className="flex items-center gap-2 justify-between bg-[#f8fafc] rounded-lg px-3 py-2"
//               >
//                 <span className="font-semibold">
//                   {s.itemA.name} vs {s.itemB.name}
//                 </span>
//                 <span>
//                   <Heart
//                     fill={likes[s.id]?.A || likes[s.id]?.B ? "#f43f5e" : "none"}
//                     className="inline w-4 h-4 mr-1"
//                   />
//                   <button
//                     className="ml-1"
//                     aria-label="Share"
//                     onClick={() => openShare(s.id, votes[s.id] || "A")}
//                   >
//                     <Share2 className="w-4 h-4" />
//                   </button>
//                 </span>
//                 <span>{votes[s.id] === "A" ? s.itemA.name : s.itemB.name}</span>
//               </div>
//             ))}
//           </div>
//           <button
//             className="mt-2 px-6 py-2 bg-[#0f4c81] text-white rounded-full font-bold hover:scale-105 transition"
//             onClick={() => setSessionActive(false)}
//           >
//             Play Again
//           </button>
//         </div>
//       </section>
//     );
//   } else {
//     // Landing state
//     cardSection = (
//       <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
//         {/* Pancakes */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="right"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src="/compare/kids99.jpg"
//                 alt="Pancakes"
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#0f4c81] font-bold text-lg">Pancakes</p>
//                 <button className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4 rounded-xl shadow-lg">
//               <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
//                 Soft, fluffy, syrupy... yum!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//         {/* Waffles */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="left"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src="/compare/kids100.jpg"
//                 alt="Waffles"
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#ff7b00] font-bold text-lg">Waffles</p>
//                 <button className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4 rounded-xl shadow-lg">
//               <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
//                 Crispy squares, sweet pockets!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//       </section>
//     );
//   }

//   return (
//     <main className="relative min-h-screen bg-[#f2f9fd] text-[#222] flex flex-col items-center py-6 px-4">
//       {/* Header */}
//       <header className="w-full max-w-5xl flex items-center justify-between px-6 py-4 bg-[#0f4c81] text-white shadow-md rounded-md">
//         <h1 className="text-2xl font-bold">Yoister Kids</h1>
//         <div className="relative group">
//           <button className="text-sm underline hover:opacity-80 flex items-center gap-1">
//             <UserCircle2 className="w-5 h-5" /> For Grown-Ups
//           </button>
//           <div className="hidden group-hover:block absolute right-0 mt-2 bg-white text-[#0f4c81] text-sm shadow-lg rounded-md py-2 px-4 z-50">
//             <ul className="space-y-1">
//               <li>Sign up</li>
//               <li>Login</li>
//               <li>Profile</li>
//               <li>Settings</li>
//             </ul>
//           </div>
//         </div>
//       </header>

//       {/* Start Now sticky button */}
//       <div className="w-full max-w-md flex justify-center mt-4 mb-2">
//         <button
//           className="text-base font-bold bg-white text-[#0f4c81] px-5 py-2 rounded-full shadow hover:bg-blue-100 transition border"
//           onClick={() => {
//             if (sessionActive) setResetConfirm(true);
//             else setSessionOpen((v) => !v);
//           }}
//         >
//           Start Now
//         </button>
//         {sessionOpen && (
//           <div className="absolute top-28 left-0 right-0 mx-auto bg-white rounded-xl shadow-lg p-5 flex flex-col items-center border z-50 max-w-xs">
//             <h3 className="mb-3 text-lg font-bold text-[#0f4c81]">
//               How many showdowns?
//             </h3>
//             <div className="flex gap-3 mb-2">
//               {ALL_COUNTS.map((n) => (
//                 <button
//                   key={n}
//                   className="px-5 py-2 bg-blue-50 rounded-lg border text-[#0f4c81] font-semibold hover:bg-blue-100 transition"
//                   onClick={() => startSession(n)}
//                 >
//                   {n}
//                 </button>
//               ))}
//             </div>
//             <button
//               className="text-xs text-[#999] mt-2 underline"
//               onClick={() => setSessionOpen(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//         {resetConfirm && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
//               <p className="mb-4 text-lg text-[#0f4c81] font-semibold">
//                 This will reset your current session.
//                 <br />
//                 Are you sure?
//               </p>
//               <div className="flex gap-4">
//                 <button
//                   className="px-6 py-2 bg-[#0f4c81] text-white rounded-full font-bold hover:scale-105 transition"
//                   onClick={handleReset}
//                 >
//                   Yes, reset
//                 </button>
//                 <button
//                   className="px-6 py-2 bg-gray-200 text-[#0f4c81] rounded-full font-bold hover:bg-gray-300 transition"
//                   onClick={() => setResetConfirm(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Progress bar */}
//       <div className="w-full max-w-md text-center text-base font-semibold mt-2 mb-1">
//         <span>{progress}</span>
//       </div>

//       {cardSection}

//       {/* Share Modal */}
//       {shareModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center max-w-xs relative">
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//               onClick={closeShare}
//               aria-label="Close"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <h3 className="text-lg font-bold mb-3">Share this showdown</h3>
//             <input
//               className="w-full mb-3 px-2 py-1 border rounded bg-gray-50 text-sm"
//               value={typeof window !== "undefined" ? window.location.href : ""}
//               readOnly
//               onFocus={(e) => e.target.select()}
//             />
//             <button
//               className="mb-3 px-4 py-1 bg-[#0f4c81] text-white rounded-full font-bold hover:bg-blue-700 transition"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 closeShare();
//               }}
//             >
//               Copy Link
//             </button>
//             <div className="flex gap-3">
//               <span className="opacity-50">
//                 <Share2 className="w-6 h-6" />
//               </span>
//               <span className="opacity-50">
//                 <Share2 className="w-6 h-6" />
//               </span>
//               <span className="opacity-50">
//                 <Share2 className="w-6 h-6" />
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Category Nav */}
//       <nav className="mt-10 flex flex-wrap justify-center gap-3">
//         {[
//           ["Happy vs Sad", "/kids/happy"],
//           ["Action Verbs", "/kids/verbs"],
//           ["Animals", "/kids/animals"],
//         ].map(([label, href]) => (
//           <Link
//             key={href}
//             href={href}
//             className="text-sm px-4 py-2 bg-white border border-[#0f4c81] rounded-full text-[#0f4c81] hover:bg-[#e6f0f6] transition"
//           >
//             {label}
//           </Link>
//         ))}
//       </nav>

//       {/* Learn More */}
//       <details className="mt-6 text-sm bg-blue-50 border-l-4 border-[#0f4c81] p-4 rounded-md text-zinc-700 cursor-pointer max-w-xl w-full">
//         <summary className="font-medium text-[#0f4c81]">
//           What’s this all about?
//         </summary>
//         <div className="mt-2 text-left">
//           Yoister helps you learn English by choosing between fun, vivid ideas —
//           no tests, just play!
//         </div>
//       </details>

//       {/* Footer */}
//       <footer className="w-full mt-12 text-center text-sm text-gray-500">
//         &copy; 2025 Yoister ·{" "}
//         <a href="#" className="underline">
//           Privacy Policy
//         </a>
//       </footer>
//     </main>
//   );
// }

// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FlipCard } from "@/components/FlipCard";
// import { UserCircle2 } from "lucide-react";

// export default function KidsHomePage() {
//   return (
//     <main className="relative min-h-screen bg-[#f2f9fd] text-[#222] flex flex-col items-center py-6 px-4">
//       {/* Header */}
//       <header className="w-full max-w-5xl flex items-center justify-between px-6 py-4 bg-[#0f4c81] text-white shadow-md rounded-md">
//         <h1 className="text-2xl font-bold">Yoister Kids</h1>
//         <div className="relative group">
//           <button className="text-sm underline hover:opacity-80 flex items-center gap-1">
//             <UserCircle2 className="w-5 h-5" /> For Grown-Ups
//           </button>
//           <div className="hidden group-hover:block absolute right-0 mt-2 bg-white text-[#0f4c81] text-sm shadow-lg rounded-md py-2 px-4 z-50">
//             <ul className="space-y-1">
//               <li>Sign up</li>
//               <li>Login</li>
//               <li>Profile</li>
//               <li>Settings</li>
//             </ul>
//           </div>
//         </div>
//       </header>

//       {/* Intro */}
//       <section className="text-left mt-6 max-w-xl w-full">
//         <h2 className="text-xl md:text-2xl font-semibold">
//           You are what you choose. Pick a side.
//         </h2>
//       </section>

//       {/* FlipCard Showdown */}
//       <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
//         {/* Pancakes - only right arrow */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="right"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src="/compare/kids99.jpg"
//                 alt="Option A"
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//               />

//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#0f4c81] font-bold text-lg">Pancakes</p>
//                 <button className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4 rounded-xl shadow-lg">
//               <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
//                 Soft, fluffy, syrupy... yum!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//         {/* Waffles - only left arrow */}
//         <FlipCard
//           className="w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           arrowSide="left"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
//               <Image
//                 src="/compare/kids100.jpg"
//                 alt="Option B"
//                 fill
//                 sizes="(max-width: 768px) 90vw, 240px"
//                 className="object-cover rounded-xl"
//               />

//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#ff7b00] font-bold text-lg">Waffles</p>
//                 <button className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4 rounded-xl shadow-lg">
//               <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
//                 Crispy squares, sweet pockets!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//       </section>

//       {/* Not Saved Yet */}
//       <div className="mt-6 text-center">
//         <p className="text-sm text-gray-500 italic">
//           Your choice isn’t saved yet — but that’s coming soon!
//         </p>
//       </div>

//       {/* Learn More */}
//       <details className="mt-6 text-sm bg-blue-50 border-l-4 border-[#0f4c81] p-4 rounded-md text-zinc-700 cursor-pointer max-w-xl w-full">
//         <summary className="font-medium text-[#0f4c81]">
//           What’s this all about?
//         </summary>
//         <div className="mt-2 text-left">
//           Yoister helps you learn English by choosing between fun, vivid ideas —
//           no tests, just play!
//         </div>
//       </details>

//       {/* Category Nav */}
//       <nav className="mt-10 flex flex-wrap justify-center gap-3">
//         {["Category 1", "Category 2", "Category 3"].map((label, i) => (
//           <button
//             key={i}
//             className="text-sm px-5 py-2 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 border border-pink-300 text-[#333] font-semibold shadow hover:scale-105 transition"
//           >
//             {label}
//           </button>
//         ))}
//       </nav>

//       {/* Footer */}
//       <footer className="w-full mt-12 text-center text-sm text-gray-500">
//         &copy; 2025 Yoister ·{" "}
//         <a href="#" className="underline">
//           Privacy Policy
//         </a>
//       </footer>
//     </main>
//   );
// }

// "use client";

// /**
//  * File: app/kids/page.tsx
//  * Final Locked — July 26, 2025
//  *
//  * ✅ FlipCard showdown between Pancakes vs Waffles
//  * ✅ Uses local images: /compare/kids99.jpg and kids100.jpg
//  * ✅ Hover on edge flips card, click locks it
//  * ✅ Vote buttons aligned, back panel readable
//  * ✅ One-screen, mobile-first layout — no scroll
//  */

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FlipCard } from "@/components/FlipCard";

// export default function KidsHomePage() {
//   return (
//     <main className="relative min-h-screen bg-[#f2f9fd] text-[#222] flex flex-col items-center py-6 px-4">
//       {/* Header */}
//       <header className="w-full flex items-center justify-between px-6 py-4 bg-[#0f4c81] text-white shadow-md rounded-md">
//         <h1 className="text-2xl font-bold">Yoister Kids</h1>
//         <a href="#" className="text-sm underline hover:opacity-80">
//           For Grown-Ups
//         </a>
//       </header>

//       {/* Intro */}
//       <section className="text-center mt-6 max-w-xl">
//         <h2 className="text-xl md:text-2xl font-semibold">
//           Pick One. Learn More.
//         </h2>
//         <p className="text-gray-700 mt-1 text-sm">
//           Every choice tells a story. Flip the cards and choose your favorite!
//         </p>
//       </section>

//       {/* FlipCard Showdown */}
//       <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
//         {/* Pancakes */}
//         <FlipCard
//           className="bg-white rounded-xl shadow-lg w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center">
//               <Image
//                 src="/compare/kids99.jpg"
//                 alt="Pancakes"
//                 fill
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#0f4c81] font-bold text-lg">Pancakes</p>
//                 <button className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4">
//               <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
//                 Soft, fluffy, syrupy... yum!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />

//         {/* Waffles */}
//         <FlipCard
//           className="bg-white rounded-xl shadow-lg w-[260px] h-[360px]"
//           panelClassName="rounded-xl overflow-hidden"
//           front={
//             <div className="relative w-full h-full flex flex-col justify-end items-center">
//               <Image
//                 src="/compare/kids100.jpg"
//                 alt="Waffles"
//                 fill
//                 className="object-cover rounded-xl"
//                 priority
//               />
//               <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
//                 <p className="text-[#ff7b00] font-bold text-lg">Waffles</p>
//                 <button className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                   Vote!
//                 </button>
//               </div>
//             </div>
//           }
//           back={
//             <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4">
//               <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
//                 Crispy squares, sweet pockets!
//               </p>
//               <button className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
//                 Vote!
//               </button>
//             </div>
//           }
//         />
//       </section>

//       {/* Not Saved Yet */}
//       <div className="mt-6 text-center">
//         <p className="text-sm text-gray-500 italic">
//           Your choice isn’t saved yet — but that’s coming soon!
//         </p>
//       </div>

//       {/* Learn More */}
//       <details className="mt-6 text-sm bg-blue-50 border-l-4 border-[#0f4c81] p-4 rounded-md text-zinc-700 cursor-pointer max-w-xl">
//         <summary className="font-medium text-[#0f4c81]">
//           What’s this all about?
//         </summary>
//         <div className="mt-2">
//           This fun experience uses <strong>Yoister Showdowns</strong> to help
//           you learn English by comparing words, pictures, or ideas — with no
//           pressure, no score, and lots of fun!
//         </div>
//       </details>

//       {/* Category Nav */}
//       <nav className="mt-10 flex flex-wrap justify-center gap-3">
//         {[
//           ["Happy vs Sad", "/kids/happy"],
//           ["Action Verbs", "/kids/verbs"],
//           ["Animals", "/kids/animals"],
//         ].map(([label, href]) => (
//           <Link
//             key={href}
//             href={href}
//             className="text-sm px-4 py-2 bg-white border border-[#0f4c81] rounded-full text-[#0f4c81] hover:bg-[#e6f0f6] transition"
//           >
//             {label}
//           </Link>
//         ))}
//       </nav>

//       {/* Footer */}
//       <footer className="w-full mt-12 text-center text-sm text-gray-500">
//         &copy; 2025 Yoister ·{" "}
//         <a href="#" className="underline">
//           Privacy Policy
//         </a>
//       </footer>
//     </main>
//   );
// }
