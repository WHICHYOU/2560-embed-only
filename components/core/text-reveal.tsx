/**
 * File: components/core/text-reveal.tsx
 * Date: July 26, 2025
 * Purpose: Reveal text with blur and staggered vertical motion
 * Revision:
 * - FIXED TS2322 and TS2745 by casting motion.span with relaxed prop support
 * - Removed invalid 'motion/react' import and replaced with 'framer-motion'
 */

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ✅ Cast to allow TS-safe className, children, transition, etc.
const MotionSpan = motion.span as React.ComponentType<
  React.HTMLAttributes<HTMLSpanElement> & {
    initial?: any;
    animate?: any;
    transition?: any;
    children?: React.ReactNode;
  }
>;

interface TextRevealProps {
  children: string;
  className?: string;
  blur?: number;
  delay?: number;
  duration?: number;
  from?: "top" | "bottom";
  split?: "word" | "letter";
}

export const TextReveal = ({
  children,
  className,
  blur = 10,
  delay = 0.1,
  duration = 1,
  from = "bottom",
  split = "word",
}: TextRevealProps) => {
  const segments =
    split === "word" ? children.split(" ") : children.split(/(?=.)/);

  return (
    <div>
      {segments.map((c, index) => (
        <MotionSpan
          key={`${c}-${index}`}
          initial={{
            opacity: 0,
            y: from === "bottom" ? "50%" : "-50%",
            filter: `blur(${blur}px)`,
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: index * delay,
            duration,
            ease: [0.18, 0.89, 0.82, 1.04],
          }}
          className={cn(
            "inline-flex leading-none",
            split === "word" ? "mr-[0.2em]" : "",
            className
          )}
        >
          {c === " " ? "\u00A0" : <>{c}</>}
        </MotionSpan>
      ))}
      {/* Accessibility fallback */}
      <div className="sr-only">{children}</div>
    </div>
  );
};
