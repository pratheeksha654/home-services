"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
 value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="group rounded-3xl border border-white/10 bg-[#14161E] p-6 shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-[#9CA0AE]">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#ECEDF0]">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-2xl bg-[#1A1D28] p-4 ${color}`}
        >
          <Icon size={28} />
        </div>

      </div>

      <div className="mt-6 h-1 w-full rounded-full bg-white/5 overflow-hidden">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "75%" }}
          transition={{ duration: 1 }}
          className="h-full rounded-full bg-[#C8A55E]"
        />

      </div>

    </motion.div>
  );
}