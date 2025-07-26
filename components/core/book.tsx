/**
 * File: components/core/book.tsx
 * Date: July 26, 2025
 * Purpose: 3D Book Flip Animation (Hover Responsive)
 * Revision:
 * - FIXED: TS2769 — Removed invalid style props ('origin', 'z')
 * - FIXED: Replaced 'rotateY' from style to animate
 * - FIXED: Added transformOrigin where needed
 * - CLEAN: Used only valid React.CSSProperties across all style objects
 */

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// ✅ Generic wrapper to enable style, animate, events
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: any;
    transition?: any;
    style?: React.CSSProperties;
    transformOrigin?: string;
  }
>;

interface BookProps {
  content: React.ReactNode;
  cover: React.ReactNode;
  backOfCover?: React.ReactNode;
  rotate?: number;
  coverRotate?: number;
  color?: string;
  className?: string;
}

export const Book = ({
  content,
  cover,
  backOfCover,
  rotate = -30,
  coverRotate = -100,
  className,
  color = "#e30012",
}: BookProps) => {
  const rotatePage = useMotionValue(0);
  const rotateSpring = useSpring(rotatePage, {
    stiffness: 100,
    damping: 40,
  });

  const handleMouseEnter = () => rotatePage.set(coverRotate);
  const handleMouseLeave = () => rotatePage.set(0);

  return (
    <div style={{ perspective: "1000px" }}>
      <MotionDiv
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateY: rotate }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={cn("relative w-52 h-80 transform-3d", className)}
      >
        {/* Cover Layer (Flipping) */}
        <MotionDiv
          animate={{ rotateY: rotateSpring }}
          transformOrigin="left"
          style={{ transformStyle: "preserve-3d" }}
          className="z-10 shadow-2xl w-full h-full absolute"
        >
          {/* Inside of Cover (Reversed Side) */}
          <div
            style={{ transform: "rotateY(180deg)" }}
            className="absolute w-full h-full top-0 left-0 overflow-hidden rounded-r-xs bg-zinc-900 backface-hidden"
          >
            {backOfCover}
          </div>

          {/* Outside of Cover */}
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden rounded-l-xs backface-hidden">
            {cover}
          </div>
        </MotionDiv>

        {/* Content Layer (Static) */}
        <MotionDiv
          style={{ zIndex: 14 }}
          className="absolute top-[1%] left-0 w-[calc(100%-3%)] h-[calc(100%-2%)] bg-zinc-50 overflow-hidden"
        >
          {content}
        </MotionDiv>

        {/* Side Strip / Binding */}
        <div className="absolute top-[1%] -right-[4%] h-[calc(100%-2%)] w-[29px] transform rotate-y-90 bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-50 bg-[length:5%_100%] bg-repeat-x shadow-2xl" />

        {/* Book Spine (Left Edge) */}
        <div
          style={{ background: color }}
          className="absolute top-0 left-0 h-full w-[30px] transform -rotate-y-90 -translate-x-[50%]"
        />

        {/* Back Panel */}
        <MotionDiv
          style={{ background: color, zIndex: -15 }}
          className="absolute top-0 left-0 w-full rounded-r-xs h-full shadow-lg"
        />
      </MotionDiv>
    </div>
  );
};
