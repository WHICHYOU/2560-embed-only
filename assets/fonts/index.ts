// assets/fonts/index.ts
import { Inter, Space_Mono } from "next/font/google";

export const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Space_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// import { Geist, Geist_Mono } from "next/font/google";

// export const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// export const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });
