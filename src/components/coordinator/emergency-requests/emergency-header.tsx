import { AlertTriangle } from "lucide-react";

export default function EmergencyHeader() {
  return (
    <section className="max-w-5xl mx-auto text-center pt-10 pb-4 mt-10">
      {/* Emergency Badge */}
      <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400">
        <AlertTriangle size={14} />
        Dispatcher Dashboard
      </span>

      {/* Title */}
      <h1 className="mt-6 text-4xl font-extrabold text-[#ECEDF0] lg:text-5xl">
        Emergency Requests
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-[#9CA0AE]">
        Review emergency requests submitted by customers and assign the most
        suitable available technician.
      </p>
    </section>
  );
}
