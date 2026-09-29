"use client";

import ServiceCard from "@/components/cards/service-card";
import { services } from "@/data/services";

export default function PopularServices() {
  
  const scrollingServices = [...services, ...services];

  return (
    <section className="bg-[#0D0F14] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-bold text-[#ECEDF0]">
          Popular Services
        </h2>

        <p className="mt-3 mb-10 max-w-2xl text-[#9CA0AE]">
          Choose from our most requested home repair and maintenance services.
        </p>

        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
            {scrollingServices.map((service, index) => (
              <div key={index} className="w-[320px] flex-shrink-0">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}