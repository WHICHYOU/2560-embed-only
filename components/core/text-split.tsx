"use client";

/**
 * File: components/core/text-split.tsx
 * Date: July 26, 2025
 * Description: Hover-animated split text effect per character
 * Revision: ✅ Fixed framer-motion typing issues, supports className safely
 */

import { useState } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

// ✅ Safely typed MotionSpan
const MotionSpan = motion(
  React.forwardRef<
    HTMLSpanElement,
    React.HTMLProps<HTMLSpanElement> & MotionProps
  >((props, ref) => <span ref={ref} {...props} />)
);

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
}

export const TextSplit = ({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
}: TextSplitProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getOffset = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = Math.abs(index - hoverIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {children.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <div
            key={`${char}-${index}`}
            className="relative flex flex-col h-[1em] w-auto leading-none"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <MotionSpan
              initial={false}
              animate={{ y: `-${offset}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", topClassName)}
            >
              {displayChar}
            </MotionSpan>

            <MotionSpan
              initial={false}
              animate={{ y: `${offset}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", bottomClassName)}
            >
              <span className="block -translate-y-1/2">{displayChar}</span>
            </MotionSpan>
          </div>
        );
      })}
    </div>
  );
};
