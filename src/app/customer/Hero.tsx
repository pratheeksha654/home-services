"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Clock3, Wrench } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";


export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#0D0F14] flex items-center">



      <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#C8A55E]/10 blur-[150px]" />
      <div className="absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-[#818CF8]/10 blur-[170px]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col-reverse items-center px-6 py-10 lg:flex-row lg:px-16">


        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex-1 z-10"
        >



          <h1 className="mt-6 text-4xl font-bold leading-tight text-[#ECEDF0] lg:text-5xl">
            Book Trusted
            <span className="block text-[#C8A55E]">
              Home Services
            </span>
          </h1>


          <p className="mt-6 max-w-xl text-base leading-7 text-[#9CA0AE]">
            Connect with verified technicians for electrical,
            plumbing, AC repair, carpentry and more. Fast,
            reliable and transparent home services whenever you
            need them.
          </p>


          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#C8A55E]" />
              <span className="text-[#ECEDF0]">
                Verified Professionals
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#C8A55E]" />
              <span className="text-[#ECEDF0]">
                Fast Emergency Support
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-[#C8A55E]" />
              <span className="text-[#ECEDF0]">
                Transparent Pricing
              </span>
            </div>

          </div>


          <div className="mt-10 flex flex-wrap gap-4">

            <Button onClick={() => router.push("/customer/book")}>
              Book Service
            </Button>

            <Button onClick={() => router.push("/customer/emergency-booking")} variant="outline">
              Emergency Booking

            </Button>

          </div>


        </motion.div>


        <motion.div
          initial={{
            opacity: 0,
            x: 180,
            rotate: 8,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex-[1.4] flex items-center justify-center"
        >


          <div className="absolute h-[700px] w-[700px] rounded-full bg-gradient-to-r from-[#C8A55E]/15 via-[#C8A55E]/5 to-[#818CF8]/10 blur-[150px]" />

          <Image
            src="/hero/hero-illustration.jpg"
            alt="Home Repair Illustration"
            width={1400}
            height={1400}
            priority
            className="
              relative
              z-10
              w-[650px]
              md:w-[750px]
              lg:w-[900px]
              xl:w-[1000px]
              2xl:w-[1100px]
              h-auto
              object-contain
              drop-shadow-[0_45px_80px_rgba(0,0,0,0.55)]
            "
          />

        </motion.div>

      </div>
    </section>
  );
}