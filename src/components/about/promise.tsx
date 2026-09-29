"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, Clock3, BadgeCheck } from "lucide-react";

const promises = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Every technician is verified and trained to deliver dependable service.",
  },
  {
    icon: Clock3,
    title: "On-Time Service",
    description:
      "We value your time with prompt arrivals and efficient solutions.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    description:
      "Every completed service is backed by our commitment to customer satisfaction.",
  },
];

export default function Promise() {
  return (
    <section className="relative overflow-hidden px-6 py-28">

      

      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#C8A55E]/10 blur-[170px]" />
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#818CF8]/10 blur-[170px]" />

      <div className="relative mx-auto max-w-6xl">

        

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#C8A55E]/40 bg-[#C8A55E]/10 font-semibold text-[#C8A55E]"
        >
          03
        </motion.div>

    

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-5xl font-bold"
        >
          Our <span className="text-[#C8A55E]">Promise</span>
        </motion.h2>

        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#C8A55E]" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-gray-400"
        >
          Every service we provide is built on trust, transparency, and
          professionalism. From your first booking to the final completion,
          our focus is delivering a seamless experience you can rely on.
        </motion.p>

        

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ y: -6 }}
          className="group relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl"
        >
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#C8A55E]/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

          <HeartHandshake
            size={52}
            className="mx-auto text-[#C8A55E]"
          />

          <h3 className="mt-6 text-center text-3xl font-semibold">
            Your Home, Our Responsibility
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-400">
            We don't just complete tasks—we build long-term trust by
            providing reliable professionals, honest pricing, and
            exceptional customer care every step of the way.
          </p>
        </motion.div>

        

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {promises.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C8A55E]/30 bg-[#C8A55E]/10">
                  <Icon
                    size={30}
                    className="text-[#C8A55E]"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}