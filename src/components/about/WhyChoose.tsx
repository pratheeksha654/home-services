"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Wallet,
  Lock,
} from "lucide-react";

import GlassCard from "./GlassCard";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Experts",
    description:
      "Every technician is background verified, experienced, and committed to delivering quality service.",
  },
  {
    icon: Zap,
    title: "Quick Response",
    description:
      "Fast technician assignment and timely service whenever you need assistance.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "Clear estimates with no hidden charges, ensuring complete pricing transparency.",
  },
  {
    icon: Lock,
    title: "Secure Booking",
    description:
      "Your booking details and personal information are always protected.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden px-6 py-28">

    

      <div className="absolute left-[-200px] top-1/2 h-[450px] w-[450px] rounded-full bg-[#C8A55E]/10 blur-[170px]" />

      

      <div className="absolute right-[-200px] bottom-0 h-[450px] w-[450px] rounded-full bg-[#818CF8]/10 blur-[170px]" />

      

      <div className="absolute left-10 top-20 grid grid-cols-5 gap-4 opacity-25">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="h-1 w-1 rounded-full bg-[#C8A55E]"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">

        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#C8A55E]/40 bg-[#C8A55E]/10 text-xl font-semibold text-[#C8A55E]"
        >
          02
        </motion.div>

    

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .1 }}
          className="mt-8 text-center text-5xl font-bold"
        >
          Why Choose{" "}
          <span className="text-[#C8A55E]">
            FixNest?
          </span>
        </motion.h2>

        

        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#C8A55E]" />

        

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-8 text-gray-400"
        >
          We combine trusted professionals with smart technology to
          provide reliable, secure, and hassle-free home services.
        </motion.p>

        
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 60,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.15,
              }}
            >

              <GlassCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}