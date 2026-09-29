"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Story() {
  return (
    <section className="relative overflow-hidden px-6 py-28">

      
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#C8A55E]/10 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#818CF8]/10 blur-[160px]" />

      <div className="relative mx-auto max-w-5xl">

        

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 flex items-center gap-5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C8A55E]/40 bg-[#C8A55E]/10 font-semibold text-[#C8A55E]">
            01
          </div>

          <div className="h-px w-20 bg-[#C8A55E]" />
        </motion.div>

        

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold leading-tight lg:text-6xl">
            Our <span className="text-[#C8A55E]">Story</span>
          </h2>

          <div className="mt-5 h-1 w-24 rounded-full bg-[#C8A55E]" />
        </motion.div>

  

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="group mt-14 rounded-[32px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl transition-all duration-500 hover:border-[#C8A55E]/40"
        >
          <p className="text-lg leading-9 text-gray-300">
            FixNest was founded with a simple mission—to make home service
            booking effortless, transparent, and reliable. We recognised the
            frustration homeowners face when searching for trustworthy
            professionals, especially during urgent situations.
          </p>

          <p className="mt-7 text-lg leading-9 text-gray-400">
            Our platform connects customers with verified technicians across
            multiple service categories, ensuring every booking is secure,
            convenient, and handled with professionalism from start to finish.
            Whether it's an emergency repair or routine maintenance, we're
            committed to delivering dependable solutions with complete peace of
            mind.
          </p>
        </motion.div>

      

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          className="group relative mt-12 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl"
        >
        

          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#C8A55E]/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

          <Quote
            size={42}
            className="mb-6 text-[#C8A55E]"
          />

          <p className="text-2xl italic leading-10 text-white">
            "Every service begins with trust and ends with customer
            satisfaction. That's the promise we strive to deliver every single
            day."
          </p>

          <div className="mt-8 h-px w-24 bg-[#C8A55E]" />

          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-[#C8A55E]">
            FixNest
          </p>
        </motion.div>

      </div>

    </section>
  );
}