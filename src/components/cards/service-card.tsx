"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    image: string;
    price: string;
    type: string;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#14161E]"
    >
      <div className="relative h-52">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">

        <h3 className="text-2xl font-semibold text-[#ECEDF0]">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#9CA0AE]">
          {service.description}
        </p>

        <div className="mt-5">

          {service.type === "inspection" ? (
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">
              Inspection Required
            </span>
          ) : (
            <span className="rounded-full bg-[#C8A55E]/10 px-3 py-1 text-sm text-[#E4D5A8]">
              {service.price}
            </span>
          )}

        </div>

        <p className="mt-5 text-sm text-[#9CA0AE]">
          Final pricing may vary depending on inspection and service complexity.
        </p>

        
      </div>
    </motion.div>
  );
}