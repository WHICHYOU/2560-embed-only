/**
 * File: app/page.tsx
 * Date: July 26, 2025
 * Purpose: Root entry for the Yoister Kids Embed app
 * Notes:
 * - Redirects immediately to /kids
 * - Keeps base clean while deferring UI to scoped folder
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  // Immediately send any access to root to /kids
  redirect("/kids");
}
