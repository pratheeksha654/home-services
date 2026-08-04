"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        className="group cursor-pointer rounded-3xl border border-white/10 bg-[#14161E] p-6 transition-all"
      >
        <div className="flex items-center justify-between">

          <div
            className={`rounded-2xl p-4 ${color}`}
          >
            <Icon
              size={30}
              className="text-white"
            />
          </div>

          <ArrowRight
            className="text-[#9CA0AE] group-hover:translate-x-1 transition"
            size={22}
          />

        </div>

        <h3 className="mt-6 text-xl font-bold text-[#ECEDF0]">
          {title}
        </h3>

        <p className="mt-3 text-[#9CA0AE] leading-7">
          {description}
        </p>

      </motion.div>
    </Link>
  );
}