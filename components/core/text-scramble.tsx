"use client";

/**
 * File: components/core/text-scramble.tsx
 * ...[full original comments, unchanged]...
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ✅ Custom typed motion span with native span attributes
const MotionSpan = motion.span as React.ComponentType<
  HTMLAttributes<HTMLSpanElement> & {
    animate?: any;
    initial?: any;
    children?: React.ReactNode;
  }
>;

interface TextScrambleProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  duration?: number;
}

export const TextScramble = ({
  text,
  duration = 2000,
  className,
  ...rest
}: TextScrambleProps) => {
  // --- FIX: Proper timer typing for browser/SSR ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scrambled, setScrambled] = useState(text);

  useEffect(() => {
    let frame = 0;
    const characters = "!<>-_\\/[]{}—=+*^?#________";
    const queue = Array.from(text).map((char) => ({
      from: char,
      to: characters[Math.floor(Math.random() * characters.length)],
    }));

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const output = queue
        .map((c, i) => {
          if (i < frame) return text[i];
          if (i === frame) return c.to;
          return c.from;
        })
        .join("");

      setScrambled(output);
      frame++;
      if (frame > text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setScrambled(text);
      }
    }, Math.max(16, duration / Math.max(1, text.length)));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, duration]);

  return (
    <MotionSpan
      className={cn("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...rest}
    >
      {scrambled}
    </MotionSpan>
  );
};
