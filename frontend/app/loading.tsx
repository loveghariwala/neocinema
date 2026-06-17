"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950/80 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Cinematic Glowing Rings */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer Ring (Red) */}
          <motion.div
            className="absolute h-full w-full rounded-full border-t-2 border-r-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner Ring (White/Gray) */}
          <motion.div
            className="absolute h-16 w-16 rounded-full border-b-2 border-l-2 border-white/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          {/* Center Logo/Initial */}
          <motion.span 
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          >
            NC
          </motion.span>
        </div>
        
        {/* Animated Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs font-black tracking-[0.4em] text-red-500 uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
          >
            Loading
          </motion.div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className="h-1 w-1 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
