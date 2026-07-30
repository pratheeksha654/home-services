"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  BriefcaseBusiness,
  UserX,
} from "lucide-react";

const technicians = [
  {
    title: "Available",
    count: 18,
    subtitle: "Ready for Assignment",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: UserCheck,
  },
  {
    title: "Busy",
    count: 24,
    subtitle: "Currently Working",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: BriefcaseBusiness,
  },
  {
    title: "Offline",
    count: 6,
    subtitle: "Unavailable",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    icon: UserX,
  },
];

export default function TechnicianOverview() {
  return (
    <section className="mt-12">

      <h2 className="mb-6 text-2xl font-bold text-[#ECEDF0]">
        Technician Overview
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">

        {technicians.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className={`rounded-3xl border ${item.border} bg-[#14161E] p-6 mb-10`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[#9CA0AE]">

                    {item.title}

                  </p>

                  <h1 className="mt-3 text-5xl font-black text-[#ECEDF0]">

                    {item.count}

                  </h1>

                  <p className="mt-2 text-sm text-[#9CA0AE]">

                    {item.subtitle}

                  </p>

                </div>

                <div
                  className={`${item.bg} rounded-2xl p-5`}
                >
                  <Icon
                    size={34}
                    className={item.color}
                  />
                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

    </section>
  );
}