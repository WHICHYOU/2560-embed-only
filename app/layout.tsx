/**
 * File: app/layout.tsx
 * Date: July 26, 2025
 * Purpose: Global layout wrapper for entire app (non-intrusive).
 * Notes:
 * - Provides HTML and BODY tag containers.
 * - Does NOT set global font, background, or styles.
 * - Suppresses hydration warning to avoid mismatches in App Router.
 * - Future routes outside /kids will inherit this base.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
