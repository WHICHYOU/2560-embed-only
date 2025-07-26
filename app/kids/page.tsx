"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FlipCard } from "@/components/FlipCard";
import { UserCircle2 } from "lucide-react";

export default function KidsHomePage() {
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

      {/* Intro */}
      <section className="text-left mt-6 max-w-xl w-full">
        <h2 className="text-xl md:text-2xl font-semibold">
          You are what you choose. Pick a side.
        </h2>
      </section>

      {/* FlipCard Showdown */}
      <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md sm:max-w-4xl">
        {/* Pancakes - only right arrow */}
        <FlipCard
          className="w-[260px] h-[360px]"
          panelClassName="rounded-xl overflow-hidden"
          arrowSide="right"
          front={
            <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
              <Image
                src="/compare/kids99.jpg"
                alt="Option A"
                fill
                sizes="(max-width: 768px) 90vw, 240px"
                className="object-cover rounded-xl"
              />

              <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
                <p className="text-[#0f4c81] font-bold text-lg">Pancakes</p>
                <button className="mt-1 px-4 py-1 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
                  Vote!
                </button>
              </div>
            </div>
          }
          back={
            <div className="w-full h-full flex flex-col justify-end items-center bg-[#e6f0f6] p-4 rounded-xl shadow-lg">
              <p className="text-[#0f4c81] text-center font-semibold text-base mt-4">
                Soft, fluffy, syrupy... yum!
              </p>
              <button className="mt-auto px-4 py-2 bg-[#0f4c81] text-white text-sm rounded-full hover:scale-105 transition">
                Vote!
              </button>
            </div>
          }
        />
        {/* Waffles - only left arrow */}
        <FlipCard
          className="w-[260px] h-[360px]"
          panelClassName="rounded-xl overflow-hidden"
          arrowSide="left"
          front={
            <div className="relative w-full h-full flex flex-col justify-end items-center rounded-xl shadow-lg bg-white">
              <Image
                src="/compare/kids100.jpg"
                alt="Option B"
                fill
                sizes="(max-width: 768px) 90vw, 240px"
                className="object-cover rounded-xl"
              />

              <div className="relative z-10 bg-white/90 w-full text-center py-3 px-2">
                <p className="text-[#ff7b00] font-bold text-lg">Waffles</p>
                <button className="mt-1 px-4 py-1 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
                  Vote!
                </button>
              </div>
            </div>
          }
          back={
            <div className="w-full h-full flex flex-col justify-end items-center bg-[#fff4e5] p-4 rounded-xl shadow-lg">
              <p className="text-[#ff7b00] text-center font-semibold text-base mt-4">
                Crispy squares, sweet pockets!
              </p>
              <button className="mt-auto px-4 py-2 bg-[#ff7b00] text-white text-sm rounded-full hover:scale-105 transition">
                Vote!
              </button>
            </div>
          }
        />
      </section>

      {/* Not Saved Yet */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 italic">
          Your choice isn’t saved yet — but that’s coming soon!
        </p>
      </div>

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

      {/* Category Nav */}
      <nav className="mt-10 flex flex-wrap justify-center gap-3">
        {["Category 1", "Category 2", "Category 3"].map((label, i) => (
          <button
            key={i}
            className="text-sm px-5 py-2 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 border border-pink-300 text-[#333] font-semibold shadow hover:scale-105 transition"
          >
            {label}
          </button>
        ))}
      </nav>

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
