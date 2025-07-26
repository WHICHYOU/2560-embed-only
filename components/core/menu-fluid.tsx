/**
 * File: components/core/menu-fluid.tsx
 * Date: July 26, 2025
 * Purpose: Animated tab-style menu with fluid hover indicator
 * Revision:
 * - FIXED: Replaced broken 'motion/react' with 'framer-motion'
 * - Ensured `motion.div` layoutId, transition, and className are fully typed
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ✅ motion.div with layoutId must be cast safely
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    layoutId?: string;
    transition?: any;
    className?: string;
    children?: React.ReactNode;
  }
>;

type MenuItem = {
  label: string;
  href: string;
};

interface MenuFluidProps {
  menuItems: MenuItem[];
  className?: string;
  indicatorClassName?: string;
}

export const MenuFluid = ({
  menuItems,
  className,
  indicatorClassName,
}: MenuFluidProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "rounded-full p-1 flex items-center border border-zinc-300 dark:border-zinc-600",
        className
      )}
    >
      {menuItems.map((item, index) => (
        <Link
          key={`${item.label}-${index}`}
          href={item.href}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className="py-2 md:py-3 px-4 md:px-8 relative text-zinc-900 dark:text-zinc-50"
        >
          {hovered === index && (
            <MotionDiv
              layoutId="fluid"
              transition={{ duration: 0.2, ease: "linear" }}
              className={cn(
                "absolute inset-0 rounded-full bg-zinc-100 dark:bg-zinc-700",
                indicatorClassName
              )}
            />
          )}
          <span className="font-semibold text-sm z-20 relative">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
