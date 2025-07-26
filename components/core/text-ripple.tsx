/**
 * File: components/core/text-ripple.tsx
 * Date: July 26, 2025
 * Purpose: Hover-reactive ripple animation on per-character basis
 * Revision:
 * - FIXED TS2745 by coercing motion.span children to valid ReactNode
 * - FIXED TS2322 by casting MotionSpan safely for runtime animation object
 
| Error                                        | Fix                                                               |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `children` expects MotionValue or collection | ✅ Wrapped single char in `<>{char}</>` so it's JSX not raw string |
| `animate={{ scaleY }}` not assignable        | ✅ Cast `MotionSpan` to loose `ComponentType` with `animate?: any` |
| Hover handlers + className dropped           | ✅ Manually typed `React.HTMLAttributes<HTMLSpanElement>`          |
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ✅ Safe override to allow className, children, animate
const MotionSpan = motion.span as React.ComponentType<
  React.HTMLAttributes<HTMLSpanElement> & {
    animate?: any;
    variants?: any;
    children?: React.ReactNode;
  }
>;

interface TextRippleProps {
  children: string;
  className?: string;
  maxScale?: number;
  falloff?: number;
}

export const TextRipple = ({
  children,
  className,
  maxScale = 2,
  falloff = 0.3,
}: TextRippleProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chars = children.split("");

  const getScaleY = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    return Math.max(1, maxScale - distance * falloff);
  };

  return (
    <div className={cn("relative font-bold text-2xl", className)}>
      {chars.map((char, index) => (
        <MotionSpan
          key={`${char}-${index}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="inline-block origin-bottom leading-[0.7]"
          animate={{ scaleY: getScaleY(index) }}
        >
          {/* ✅ Coerce single char to valid JSX Node */}
          {char === " " ? "\u00A0" : <>{char}</>}
        </MotionSpan>
      ))}
    </div>
  );
};
