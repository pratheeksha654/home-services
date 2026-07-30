"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Bell,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardHero() {
    const images = [
  "/coordinator/hero1.png",
  "/coordinator/hero2.png",
  "/coordinator/hero3.png",
  "/coordinator/hero4.png",
];

const [currentImage, setCurrentImage] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, 2000); // Change every 5 seconds

  return () => clearInterval(interval);
}, []);
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-3xl border border-white/10"
    >
      {/* Background Image */}
      <div
  className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
  style={{
    backgroundImage: `url(${images[currentImage]})`,
  }}
/>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090D]/95 via-[#08090D]/80 to-[#08090D]/60" />

      {/* Gold Glow */}
      <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#C8A55E]/15 blur-[140px]" />

      {/* Indigo Glow */}
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6366F1]/15 blur-[150px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-10 lg:p-14">

        {/* LEFT SIDE */}

        <div className="max-w-3xl">

         

          <h1 className="mt-6 text-5xl lg:text-6xl font-black leading-tight text-[#ECEDF0]">

            Welcome Back,

            <span className="block mt-2 text-[#C8A55E]">
              Coordinator 👋
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#9CA0AE]">

            Manage service requests, assign technicians,
            monitor emergency bookings and keep every
            service running smoothly from one place.

          </p>

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: .97,
            }}
            className="mt-10 flex items-center gap-3 rounded-xl bg-[#C8A55E] px-7 py-4 font-semibold text-black transition"

          >
            View Today's Services

            <ArrowUpRight size={18} />

          </motion.button>

        </div>

        {/* RIGHT CARD */}

        
      </div>

    </motion.section>
  );
}