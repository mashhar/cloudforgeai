"use client";

import { motion } from "framer-motion";

export function FloatingGradients() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Orb 1 - Blue */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/30 blur-3xl"
        initial={{ x: "-25%", y: "-25%" }}
        animate={{
          x: ["-25%", "-15%", "-30%", "-25%"],
          y: ["-25%", "-35%", "-20%", "-25%"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />

      {/* Gradient Orb 2 - Purple */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-3xl"
        initial={{ x: "0%", y: "0%" }}
        animate={{
          x: ["0%", "10%", "-5%", "0%"],
          y: ["0%", "-10%", "5%", "0%"],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "40%", right: "10%" }}
      />

      {/* Gradient Orb 3 - Pink */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-pink-500/25 blur-3xl"
        initial={{ x: "0%", y: "0%" }}
        animate={{
          x: ["0%", "-10%", "5%", "0%"],
          y: ["0%", "10%", "-5%", "0%"],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "15%", left: "15%" }}
      />

      {/* Gradient Orb 4 - Cyan */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-3xl"
        initial={{ x: "0%", y: "0%" }}
        animate={{
          x: ["0%", "5%", "-8%", "0%"],
          y: ["0%", "-8%", "5%", "0%"],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "20%", right: "20%" }}
      />
    </div>
  );
}
