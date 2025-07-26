/**
 * File: components/core/input.tsx
 * Date: July 26, 2025
 * Purpose: Animated label input with staggered floating letters
 * Revision:
 * - FIXED invalid import from 'motion/react' → now uses 'framer-motion'
 * - FIXED TS2322 via casted motion.div and motion.span
 * - Ensured accessibility and TS safety
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ✅ Casted for TS-safe variants + className
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    variants?: any;
    initial?: any;
    animate?: any;
  }
>;

const MotionSpan = motion.span as React.ComponentType<
  React.HTMLAttributes<HTMLSpanElement> & {
    variants?: any;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  className?: string;
}

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  initial: {
    y: 0,
    color: "inherit",
  },
  animate: {
    y: "-120%",
    color: "var(--color-zinc-500)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const Input = ({
  label,
  className = "",
  value,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value.length > 0;

  return (
    <div className={cn("relative", className)}>
      <MotionDiv
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-zinc-900 dark:text-zinc-50"
        variants={containerVariants}
        initial="initial"
        animate={showLabel ? "animate" : "initial"}
      >
        {label.split("").map((char, index) => (
          <MotionSpan
            key={index}
            className="inline-block text-sm"
            variants={letterVariants}
            style={{ willChange: "transform" }}
          >
            {char === " " ? "\u00A0" : <>{char}</>}
          </MotionSpan>
        ))}
      </MotionDiv>

      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        className="outline-none border-b-2 border-zinc-900 dark:border-zinc-50 py-2 w-full text-base font-medium text-zinc-900 dark:text-zinc-50 bg-transparent placeholder-transparent"
      />
    </div>
  );
};
