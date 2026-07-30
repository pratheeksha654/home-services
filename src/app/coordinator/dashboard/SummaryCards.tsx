"use client";

import StatsCard from "./StatsCard";
import { dashboardStats } from "./data";
import { motion } from "framer-motion";

export default function SummaryCards() {
  return (
    <section className="mt-10">

      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-6 text-2xl font-bold text-[#ECEDF0]"
      >
        Dashboard Overview
      </motion.h2>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {dashboardStats.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}

      </div>

    </section>
  );
}