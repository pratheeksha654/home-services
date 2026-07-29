"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface GlowImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function GlowImage({
  src,
  alt,
  className = "",
}: GlowImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      
      <div className="absolute -inset-5 rounded-[45px] bg-[#C8A55E]/20 blur-3xl" />

      
      <div className="relative rounded-[40px] border border-[#C8A55E]/40 bg-[#12141C] p-[2px]">

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          transition={{
            duration: 0.4,
          }}
          className="overflow-hidden rounded-[38px]"
        >
          <Image
            src={src}
            alt={alt}
            width={900}
            height={700}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
        </motion.div>

      </div>
    </motion.div>
  );
}