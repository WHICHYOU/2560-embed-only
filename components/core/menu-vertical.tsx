/**
 * File: components/core/menu-vertical.tsx
 * Date: July 26, 2025
 * Purpose: Vertical animated navigation menu using Framer Motion
 * Revision:
 * - Replaced invalid 'motion/react' with 'framer-motion'
 * - Fixed `motion.create()` and replaced with safe typed wrappers
 * - Enabled `variants`, `transition`, and `className` with full TS support
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ Safely cast motion wrapper for Link
const MotionLink = motion(Link) as React.ComponentType<
  React.ComponentProps<typeof Link> & {
    variants?: any;
    transition?: any;
    className?: string;
  }
>;

// ✅ Cast motion.div for full className + variants support
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    initial?: any;
    whileHover?: any;
    variants?: any;
    transition?: any;
  }
>;

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  color?: string;
  skew?: number;
}

export const MenuVertical = ({
  menuItems = [],
  color = "#ff6900",
  skew = 0,
}: MenuVerticalProps) => {
  return (
    <div className="flex w-fit flex-col gap-4 px-10">
      {menuItems.map((item, index) => (
        <MotionDiv
          key={`${item.href}-${index}`}
          className="group/nav flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-50"
          initial="initial"
          whileHover="hover"
        >
          <MotionDiv
            variants={{
              initial: { x: "-100%", color: "inherit", opacity: 0 },
              hover: { x: 0, color, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="z-0"
          >
            <ArrowRight strokeWidth={3} className="size-10" />
          </MotionDiv>

          <MotionLink
            href={item.href}
            variants={{
              initial: { x: -40, color: "inherit" },
              hover: { x: 0, color, skewX: skew },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-semibold text-4xl no-underline"
          >
            {item.label}
          </MotionLink>
        </MotionDiv>
      ))}
    </div>
  );
};
