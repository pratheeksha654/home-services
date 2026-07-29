"use client";

import { ShieldCheck } from "lucide-react";

export default function PrivacyHero() {
  return (
    <section className="relative overflow-hidden bg-[#0D0F14] py-24">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C8A55E]/10 blur-[140px] rounded-full"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A55E]/20 bg-[#14161E]">
          <ShieldCheck
            size={40}
            className="text-[#C8A55E]"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-5xl md:text-6xl font-bold text-white">
          Privacy Policy
        </h1>

        {/* Sub Heading */}
        <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-[#C8A55E]">
          Protecting Your Data Every Step of the Way
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-[#9CA0AE]">
          Your privacy is our priority. We collect only the information
          necessary to provide secure, reliable, and efficient home services
          while keeping your personal data protected.
        </p>


      </div>
    </section>
  );
}