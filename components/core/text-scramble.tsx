"use client";

/**
 * File: components/core/text-scramble.tsx
 * Date: July 26, 2025
 * Purpose: Typing-safe scramble animation with motion.span
 * FIXES:
 * ✅ TS2322 — adds className/children support via safe MotionSpan type
 */
/**
 * File: components/core/text-scramble.tsx
 * Date: July 26, 2025
 * Purpose: Scrambling text animation using Framer Motion's <motion.span>
 *
 * -----------------------------------------------------------------------------
 * 🧨 CRITICAL COMMENT — Why This Exists
 * -----------------------------------------------------------------------------
 * TypeScript will throw TS2322 and TS2745 when using `motion.span` directly if:
 *
 *   - You pass `className`, `children`, or other native <span> props
 *   - You assume `motion.span` behaves like a normal JSX component
 *
 * This happens because `motion.span` is a **typed wrapper** that only exposes
 * Framer Motion's animation props (`MotionProps`), NOT native HTML props.
 *
 * ❌ WRONG: motion.span does NOT accept className/children directly in strict mode.
 * ❌ WRONG: motion.span is NOT typed as React.FC<...> and will not infer JSX props.
 * ❌ WRONG: Copying JSX like `<motion.span className="..." children="...">` breaks.
 *
 * -----------------------------------------------------------------------------
 * 💥 Repeated Error Symptoms
 * -----------------------------------------------------------------------------
 * ❌ TS2322: Property 'className' does not exist on type 'MotionProps'
 * ❌ TS2745: JSX element type 'motion.span' does not have any construct or call signatures
 * ❌ Animate/initial props accepted, but JSX props silently fail (e.g., `children` dropped)
 *
 * -----------------------------------------------------------------------------
 * ✅ FIX — Safe Typed Motion Component (Reusable Pattern)
 * -----------------------------------------------------------------------------
 * We cast `motion.span` to a safe composite type that merges:
 *   • Native HTML <span> props (`React.HTMLAttributes<HTMLSpanElement>`)
 *   • Framer Motion animation props (`MotionProps`)
 *   • Optional `children`, `ref`, `animate`, `initial`, etc.
 *
 * This guarantees:
 *   ✔ TypeScript accepts `className`, `children`, etc.
 *   ✔ IDE autocomplete works
 *   ✔ Runtime behavior (hover, render) is preserved
 *   ✔ Fully compliant with React.StrictMode and TS strict
 *
 * -----------------------------------------------------------------------------
 * 🔒 USE THIS FIX EVERYWHERE motion.* IS USED WITH JSX ELEMENTS.
 * -----------------------------------------------------------------------------
 * Wrap this in `lib/ui/MotionFix.ts` or similar to prevent future breakage.
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
  const [scrambled, setScrambled] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
