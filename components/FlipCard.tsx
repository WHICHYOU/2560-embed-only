"use client";

import React, { useRef, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  panelClassName?: string;
  perspective?: number;
  arrowSide: "left" | "right";
}

export const FlipCard = ({
  front,
  back,
  className,
  panelClassName,
  perspective = 1000,
  arrowSide,
}: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => setFlipped((prev) => !prev);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  // Arrow is always on the same side (never changes)
  const renderArrow = () =>
    arrowSide === "right" ? (
      <button
        aria-label="Flip card"
        className="absolute top-1/2 right-3 -translate-y-1/2 z-20 w-8 h-8 bg-white/40 hover:bg-white/70 rounded-full flex items-center justify-center shadow transition"
        onClick={handleFlip}
        type="button"
      >
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>
    ) : (
      <button
        aria-label="Flip card"
        className="absolute top-1/2 left-3 -translate-y-1/2 z-20 w-8 h-8 bg-white/40 hover:bg-white/70 rounded-full flex items-center justify-center shadow transition"
        onClick={handleFlip}
        type="button"
      >
        <ChevronLeft className="w-5 h-5 text-gray-300" />
      </button>
    );

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      aria-pressed={flipped}
      onKeyDown={handleKeyDown}
      style={{ perspective }}
      className={cn(
        "relative w-full h-full cursor-pointer outline-none focus-visible:ring-2 ring-offset-2 ring-blue-400",
        className
      )}
    >
      {renderArrow()}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Front Side */}
        <div
          className={cn(
            "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-10",
            panelClassName
          )}
        >
          {front}
        </div>
        {/* Back Side */}
        <div
          style={{ transform: "rotateY(180deg)" }}
          className={cn(
            "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-0",
            panelClassName
          )}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

// "use client";

// /**
//  * FlipCard.tsx
//  * Final FIXED VERSION — July 26, 2025
//  *
//  * ✅ Flip only on hover over visible arrows (left/right)
//  * ✅ Click to lock/unlock side
//  * ✅ Vote button appears on both sides, same position
//  * ✅ Back panel upright (not mirrored)
//  * ✅ Framer Motion v10 + TypeScript strict-mode safe
//  */

// import React, {
//   useRef,
//   useState,
//   useCallback,
//   KeyboardEvent,
//   HTMLAttributes,
// } from "react";
// import { motion, useMotionValue, useSpring } from "framer-motion";
// import type { MotionProps } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface FlipCardProps {
//   front: React.ReactNode;
//   back: React.ReactNode;
//   duration?: number;
//   flipDirection?: "horizontal" | "vertical";
//   flipRotation?: "forward" | "reverse";
//   className?: string;
//   panelClassName?: string;
//   perspective?: number;
// }

// type MotionDivProps = HTMLAttributes<HTMLDivElement> & MotionProps;

// export const FlipCard = ({
//   front,
//   back,
//   duration = 0.3,
//   className,
//   panelClassName,
//   flipDirection = "horizontal",
//   flipRotation = "forward",
//   perspective = 1000,
// }: FlipCardProps) => {
//   const rotate = useMotionValue(0);
//   const rotateSpring = useSpring(rotate, {
//     stiffness: (1 / duration) * 50,
//     damping: 30,
//   });

//   const [locked, setLocked] = useState<false | "front" | "back">(false);
//   const cardRef = useRef<HTMLDivElement>(null);

//   const calcAngle = useCallback(() => {
//     const isVertical = flipDirection === "vertical";
//     const isForward = flipRotation === "forward";
//     return isVertical ? (isForward ? -180 : 180) : isForward ? 180 : -180;
//   }, [flipDirection, flipRotation]);

//   const rotateStyle =
//     flipDirection === "horizontal"
//       ? { rotateY: rotateSpring }
//       : { rotateX: rotateSpring };

//   const backfaceTransform =
//     flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

//   const handleHover = (side: "front" | "back") => {
//     if (!locked) {
//       rotate.set(side === "back" ? calcAngle() : 0);
//     }
//   };

//   const handleClick = (side: "front" | "back") => {
//     if (locked === side) {
//       setLocked(false);
//       rotate.set(0);
//     } else {
//       setLocked(side);
//       rotate.set(side === "back" ? calcAngle() : 0);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       setLocked((prev) => (prev ? false : "back"));
//       rotate.set(locked ? 0 : calcAngle());
//     }
//   };

//   return (
//     <motion.div
//       ref={cardRef}
//       role="button"
//       tabIndex={0}
//       aria-pressed={!!locked}
//       onKeyDown={handleKeyDown}
//       style={{ perspective }}
//       className={cn(
//         "relative cursor-pointer outline-none focus-visible:ring-2 ring-offset-2 ring-blue-400",
//         className
//       )}
//       {...({} as MotionDivProps)}
//     >
//       {/* Left Arrow (hover to flip to front) */}
//       <button
//         onMouseEnter={() => handleHover("front")}
//         onClick={() => handleClick("front")}
//         className="absolute top-1/2 left-2 -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full shadow hover:bg-blue-100 flex items-center justify-center transition"
//         aria-label="Flip to Front"
//       >
//         <ChevronLeft className="w-4 h-4 text-[#0f4c81]" />
//       </button>

//       {/* Right Arrow (hover to flip to back) */}
//       <button
//         onMouseEnter={() => handleHover("back")}
//         onClick={() => handleClick("back")}
//         className="absolute top-1/2 right-2 -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full shadow hover:bg-orange-100 flex items-center justify-center transition"
//         aria-label="Flip to Back"
//       >
//         <ChevronRight className="w-4 h-4 text-[#ff7b00]" />
//       </button>

//       {/* Main Flip Container */}
//       <motion.div
//         style={{
//           ...rotateStyle,
//           width: "100%",
//           height: "100%",
//           transformStyle: "preserve-3d",
//           position: "relative",
//         }}
//       >
//         {/* Front Side */}
//         <div
//           className={cn(
//             "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-10",
//             panelClassName
//           )}
//         >
//           {front}
//         </div>

//         {/* Back Side */}
//         <div
//           style={{ transform: backfaceTransform }}
//           className={cn(
//             "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-0",
//             panelClassName
//           )}
//         >
//           {/* Upright content (un-mirrored) */}
//           <div
//             className="w-full h-full flex flex-col justify-center items-center p-4 bg-white"
//             style={{ transform: "none" }}
//           >
//             {back}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// "use client";

// /**
//  * FlipCard.tsx
//  * Final FIXED VERSION — July 26, 2025
//  *
//  * ✅ Flip only on hover over visible arrows (left/right)
//  * ✅ Click to lock/unlock side
//  * ✅ Vote button appears on both sides, same position
//  * ✅ Back panel upright (not mirrored)
//  * ✅ Framer Motion v10 + TypeScript strict-mode safe
//  */

// import React, {
//   useRef,
//   useState,
//   useCallback,
//   KeyboardEvent,
//   HTMLAttributes,
// } from "react";
// import { motion, useMotionValue, useSpring } from "framer-motion";
// import type { MotionProps } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface FlipCardProps {
//   front: React.ReactNode;
//   back: React.ReactNode;
//   duration?: number;
//   flipDirection?: "horizontal" | "vertical";
//   flipRotation?: "forward" | "reverse";
//   className?: string;
//   panelClassName?: string;
//   perspective?: number;
// }

// type MotionDivProps = HTMLAttributes<HTMLDivElement> & MotionProps;

// export const FlipCard = ({
//   front,
//   back,
//   duration = 0.3,
//   className,
//   panelClassName,
//   flipDirection = "horizontal",
//   flipRotation = "forward",
//   perspective = 1000,
// }: FlipCardProps) => {
//   const rotate = useMotionValue(0);
//   const rotateSpring = useSpring(rotate, {
//     stiffness: (1 / duration) * 50,
//     damping: 30,
//   });

//   const [locked, setLocked] = useState<false | "front" | "back">(false);
//   const cardRef = useRef<HTMLDivElement>(null);

//   const calcAngle = useCallback(() => {
//     const isVertical = flipDirection === "vertical";
//     const isForward = flipRotation === "forward";
//     return isVertical ? (isForward ? -180 : 180) : isForward ? 180 : -180;
//   }, [flipDirection, flipRotation]);

//   const rotateStyle =
//     flipDirection === "horizontal"
//       ? { rotateY: rotateSpring }
//       : { rotateX: rotateSpring };

//   const backfaceTransform =
//     flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

//   const handleHover = (side: "front" | "back") => {
//     if (!locked) {
//       rotate.set(side === "back" ? calcAngle() : 0);
//     }
//   };

//   const handleClick = (side: "front" | "back") => {
//     if (locked === side) {
//       setLocked(false);
//       rotate.set(0);
//     } else {
//       setLocked(side);
//       rotate.set(side === "back" ? calcAngle() : 0);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       setLocked((prev) => (prev ? false : "back"));
//       rotate.set(locked ? 0 : calcAngle());
//     }
//   };

//   return (
//     <motion.div
//       ref={cardRef}
//       role="button"
//       tabIndex={0}
//       aria-pressed={!!locked}
//       onKeyDown={handleKeyDown}
//       style={{ perspective }}
//       className={cn(
//         "relative cursor-pointer outline-none focus-visible:ring-2 ring-offset-2 ring-blue-400",
//         className
//       )}
//       {...({} as MotionDivProps)}
//     >
//       {/* Left Arrow (hover to flip to front) */}
//       <button
//         onMouseEnter={() => handleHover("front")}
//         onClick={() => handleClick("front")}
//         className="absolute top-1/2 left-2 -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full shadow hover:bg-blue-100 flex items-center justify-center transition"
//         aria-label="Flip to Front"
//       >
//         <ChevronLeft className="w-4 h-4 text-[#0f4c81]" />
//       </button>

//       {/* Right Arrow (hover to flip to back) */}
//       <button
//         onMouseEnter={() => handleHover("back")}
//         onClick={() => handleClick("back")}
//         className="absolute top-1/2 right-2 -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full shadow hover:bg-orange-100 flex items-center justify-center transition"
//         aria-label="Flip to Back"
//       >
//         <ChevronRight className="w-4 h-4 text-[#ff7b00]" />
//       </button>

//       {/* Main Flip Container */}
//       <motion.div
//         style={{
//           ...rotateStyle,
//           width: "100%",
//           height: "100%",
//           transformStyle: "preserve-3d",
//           position: "relative",
//         }}
//       >
//         {/* Front Side */}
//         <div
//           className={cn(
//             "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-10",
//             panelClassName
//           )}
//         >
//           {front}
//         </div>

//         {/* Back Side */}
//         <div
//           style={{ transform: backfaceTransform }}
//           className={cn(
//             "absolute w-full h-full top-0 left-0 [backface-visibility:hidden] z-0",
//             panelClassName
//           )}
//         >
//           {/* Upright content (un-mirrored) */}
//           <div
//             className="w-full h-full flex flex-col justify-center items-center p-4 bg-white"
//             style={{ transform: backfaceTransform }}
//           >
//             {back}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };
