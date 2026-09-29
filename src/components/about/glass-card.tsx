"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlassCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function GlassCard({
  icon: Icon,
  title,
  description,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
    >
      {/* Gold Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-[#C8A55E]/15 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#C8A55E]/10 blur-3xl" />
      </div>

      
      <div className="absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-[#C8A55E]/50" />

      
      <motion.div
        whileHover={{ rotate: 8, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C8A55E]/30 bg-[#C8A55E]/5"
      >
        <Icon
          size={42}
          className="text-[#C8A55E]"
          strokeWidth={1.8}
        />
      </motion.div>

      
      <h3 className="relative z-10 mt-8 text-center text-2xl font-semibold">
        {title}
      </h3>

      
      <div className="relative z-10 mx-auto mt-4 h-1 w-14 rounded-full bg-[#C8A55E]" />

    
      <p className="relative z-10 mt-6 text-center leading-8 text-gray-400">
        {description}
      </p>
    </motion.div>
  );
}