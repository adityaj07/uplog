"use client";

import { motion } from "motion/react";

interface SideWaveBarsProps {
  bars?: number;
  colors?: string[];
  sideWidthPercent?: number;
}

export const SideWaveBars = ({
  bars = 10,
  colors = ["#ff622e", "transparent"],
  sideWidthPercent = 30,
}: SideWaveBarsProps) => {
  const getGradient = (side: "left" | "right") =>
    side === "left"
      ? `linear-gradient(to right, ${colors.join(", ")})`
      : `linear-gradient(to left, ${colors.join(", ")})`;

  const renderBarColumn = (side: "left" | "right") => (
    <div
      className={`absolute top-0 h-full ${
        side === "left" ? "left-0" : "right-0"
      } flex flex-col`}
      style={{ width: `${sideWidthPercent}%` }}
    >
      {Array.from({ length: bars }).map((_, index) => {
        const position = index / (bars - 1);
        const center = 0.5;
        const distance = Math.abs(position - center);
        const scale = 0.4 + 0.6 * Math.pow(distance * 2, 1.4);

        return (
          <motion.div
            key={`${side}-bar-${index}`}
            className="h-full"
            style={{
              background: getGradient(side),
              height: `${100 / bars}%`,
              transformOrigin: side === "left" ? "left" : "right", // ✅ flip origin
            }}
            animate={{
              scaleX: [scale, scale + 0.1, scale],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
              delay: index * 0.3,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-b-4xl">
      {renderBarColumn("left")}
      {renderBarColumn("right")}
    </div>
  );
};
