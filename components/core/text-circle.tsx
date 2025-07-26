/**
 * File: components/core/text-circle.tsx
 * Date: July 26, 2025
 * Purpose: Animated circular rotating text using radial positioning
 * Revision:
 * - FIXED: Removed invalid import 'motion/react'
 * - FIXED TS2322 issues via safe className + animate handling on motion.div
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ✅ Allow motion.div with correct props
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: any;
    initial?: any;
    transition?: any;
    className?: string;
    children?: React.ReactNode;
  }
>;

interface TextCircleProps {
  text: string;
  duration?: number;
  className?: string;
}

export const TextCircle = ({
  text,
  duration = 20,
  className,
}: TextCircleProps) => {
  const letters = Array.from(text);

  return (
    <MotionDiv
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration,
        ease: "linear",
      }}
      className={cn(
        "relative rounded-full w-[200px] h-[200px] text-zinc-900 dark:text-zinc-50 font-semibold text-center text-2xl",
        className
      )}
    >
      {letters.map((letter, i) => {
        const angle = (360 / letters.length) * i;
        const factor = Number((Math.PI / letters.length).toFixed(0));
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${angle}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} className="absolute inset-0" style={{ transform }}>
            {letter}
          </span>
        );
      })}
    </MotionDiv>
  );
};
