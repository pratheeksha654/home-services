"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export default function Intro() {
  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/about/hero.png')",
      }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090D]/70 via-[#08090D]/45 to-transparent" />

      
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-[#C8A55E]/15 blur-[120px]" />

      
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#818CF8]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl"
        >
          Built on Trust.
          <br />
          Driven by <span className="text-[#dca330]">Service</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg leading-8 text-gray-300"
        >
          At FixNest, we connect homeowners with verified professionals,
          delivering fast, reliable, and transparent home services that you
          can trust.
        </motion.p>

        <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#C8A55E]/30 bg-[#C8A55E]  px-6 py-3 "
>
  <div className="h-2.5 w-2.5 rounded-full bg-[#291d04]" />

  <span className="text-sm font-medium tracking-wide text-black">
    Trusted by Homeowners Across the City
  </span>
</motion.div>
      </div>
    </section>
  );
}