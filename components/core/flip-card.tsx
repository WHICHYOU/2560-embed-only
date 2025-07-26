/**
 * File: components/core/flip-card.tsx
 * Date: July 26, 2025
 * Purpose: Interactive 3D flip card with hover rotation
 * Revision:
 * - FIXED: Replaced broken 'motion/react' with 'framer-motion'
 * - FIXED: motion.div className + hover support via casting
 * - Uses safe rotateX/rotateY style bindings
 */

"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ✅ Safe wrappers for outer/inner motion.div
const MotionOuter = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: React.CSSProperties;
    className?: string;
  }
>;

const MotionInner = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & {
    style?: React.CSSProperties;
    className?: string;
  }
>;

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  duration?: number;
  flipDirection?: "horizontal" | "vertical";
  flipRotation?: "forward" | "reverse";
  className?: string;
  panelClassName?: string;
}

export const FlipCard = ({
  front,
  back,
  duration = 0.3,
  className,
  panelClassName,
  flipDirection = "horizontal",
  flipRotation = "forward",
}: FlipCardProps) => {
  const rotate = useMotionValue(0);
  const rotateSpring = useSpring(rotate, {
    stiffness: (1 / duration) * 50,
    damping: 30,
  });

  const handleMouseEnter = () => {
    const isVertical = flipDirection === "vertical";
    const isForward = flipRotation === "forward";

    const angle = isVertical
      ? isForward
        ? -180
        : 180
      : isForward
      ? 180
      : -180;

    rotate.set(angle);
  };

  const handleMouseLeave = () => rotate.set(0);

  const rotateStyle =
    flipDirection === "horizontal"
      ? { rotateY: rotateSpring }
      : { rotateX: rotateSpring };

  const backfaceTransform =
    flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

  return (
    <MotionOuter
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={cn("relative w-56 h-72", className)}
    >
      <MotionInner
        style={{
          ...rotateStyle,
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        <div
          className={cn(
            "absolute w-full h-full top-0 left-0 rounded-xl overflow-hidden shadow-md bg-white backface-hidden",
            panelClassName
          )}
        >
          {front}
        </div>

        <div
          style={{ transform: backfaceTransform }}
          className={cn(
            "absolute w-full h-full top-0 left-0 rounded-xl overflow-hidden shadow-md bg-white backface-hidden",
            panelClassName
          )}
        >
          {back}
        </div>
      </MotionInner>
    </MotionOuter>
  );
};
