/**
 * File: components/core/gradient-bars.tsx
 * Date: July 26, 2025
 * Purpose: Animated background gradient bars with pulsating scale
 * Revision:
 * - FIXED: Replaced 'motion/react' with valid 'framer-motion'
 * - FIXED: Casted motion.div to allow animate, style, and className safely
 */

"use client";

import { motion } from "framer-motion";

// ✅ Safe cast to allow animate, style, transition, and className
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: any;
    transition?: any;
    style?: React.CSSProperties;
  }
>;

interface GradientBarsProps {
  bars?: number;
  colors?: string[];
}

export const GradientBars = ({
  bars = 20,
  colors = ["#8f0feb", "transparent"],
}: GradientBarsProps) => {
  const gradientStyle = `linear-gradient(to top, ${colors.join(", ")})`;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full">
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distance = Math.abs(position - center);
          const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

          return (
            <MotionDiv
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{ background: gradientStyle }}
              animate={{
                scaleY: [scale, scale + 0.1, scale],
                opacity: [1, 0.95, 1],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
