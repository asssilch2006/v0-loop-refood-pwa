"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: "text-lg" },
  md: { icon: 48, text: "text-2xl" },
  lg: { icon: 64, text: "text-3xl" },
  xl: { icon: 96, text: "text-5xl" },
};

export function Logo({
  size = "md",
  animated = false,
  showText = true,
  className,
}: LogoProps) {
  const { icon, text } = sizes[size];

  const IconWrapper = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <IconWrapper {...animationProps}>
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          {/* Infinity loop with leaf */}
          <path
            d="M32 24C32 24 24 16 16 16C8 16 4 24 4 32C4 40 8 48 16 48C24 48 32 40 32 40C32 40 40 48 48 48C56 48 60 40 60 32C60 24 56 16 48 16C40 16 32 24 32 24Z"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Leaf accent */}
          <path
            d="M32 20C32 20 36 12 40 10C44 8 48 10 48 10C48 10 44 14 40 18C36 22 32 20 32 20Z"
            fill="currentColor"
            opacity="0.8"
          />
          {/* Fork tines */}
          <line
            x1="28"
            y1="28"
            x2="28"
            y2="36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="28"
            x2="32"
            y2="36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="36"
            y1="28"
            x2="36"
            y2="36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </IconWrapper>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight text-foreground", text)}>
            Loop<span className="text-primary">Refood</span>
          </span>
        </div>
      )}
    </div>
  );
}
