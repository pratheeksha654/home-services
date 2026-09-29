"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accent?: "gold" | "red" | "indigo";
}

export default function ActionCard({
  title,
  description,
  icon,
  href,
  accent = "gold",
}: ActionCardProps) {
  const accentStyles = {
    gold: "text-[#C8A55E] border-[#C8A55E]/20 hover:border-[#C8A55E]",
    red: "text-red-400 border-red-500/20 hover:border-red-500",
    indigo: "text-[#818CF8] border-[#818CF8]/20 hover:border-[#818CF8]",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href}>
        <div
          className={`group h-full rounded-2xl border bg-[#14161E] p-6 transition-all duration-300 hover:bg-[#1A1D28] ${accentStyles[accent]}`}
        >
          <div className="mb-5">{icon}</div>

          <h3 className="text-xl font-semibold text-[#ECEDF0]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#9CA0AE]">
            {description}
          </p>

          <div className="mt-6 flex items-center gap-2 font-medium">
            Continue
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}