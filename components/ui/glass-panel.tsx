"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
  gradient?: boolean;
}

export function GlassPanel({
  children,
  className,
  blur = "md",
  gradient = false,
  ...props
}: GlassPanelProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border border-white/20 dark:border-white/10",
        blurClasses[blur],
        gradient
          ? "bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-900/60"
          : "bg-white/70 dark:bg-gray-900/70",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
