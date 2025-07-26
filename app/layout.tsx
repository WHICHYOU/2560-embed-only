// app/layout.tsx
import "@/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoister Embed Demo",
  description: "FlipCard showdown embed test for Yoister presets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
