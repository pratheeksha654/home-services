"use client";

import {
  CalendarPlus,
  Siren,
  MapPinned,
  History,
} from "lucide-react";

import ActionCard from "@/components/cards/ActionCard";


export default function QuickActions() {
  return (
    <section className="bg-[#0D0F14] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#ECEDF0]">
            Quick Actions
          </h2>

          <p className="mt-3 max-w-2xl text-[#9CA0AE]">
            Quickly access the most frequently used services and
            manage your bookings effortlessly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <ActionCard
            title="Book Service"
            description="Schedule a technician for regular home repair and maintenance services."
            href="/customer/book"
            accent="gold"
            icon={<CalendarPlus size={34} />}
          />

          <ActionCard
            title="Emergency Booking"
            description="Request immediate assistance for urgent repair services."
            href="/customer/emergency-booking"
            accent="red"
            icon={<Siren size={34} />}
          />

          <ActionCard
            title="Track Booking"
            description="View technician status and estimated arrival time."
            href="/customer/track-booking"
            accent="indigo"
            icon={<MapPinned size={34} />}
          />

          <ActionCard
            title="Booking History"
            description="Review all your previous completed and cancelled bookings."
            href="/customer/history"
            accent="gold"
            icon={<History size={34} />}
          />

        </div>
      </div>
    </section>
  );
}