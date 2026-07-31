import type { ReactNode } from "react";
import type { Technician, AvailabilityStatus } from "@/app/types/coordinator";
import { Star, Briefcase, CheckCircle2, UserX, Clock } from "lucide-react";

const AVAILABILITY_STYLES: Record<AvailabilityStatus, string> = {
  Available: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Busy: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Offline: "border-[#3E4252]/40 bg-[#1A1D28] text-[#5C6070]",
};

const AVAILABILITY_ICONS: Record<AvailabilityStatus, ReactNode> = {
  Available: <CheckCircle2 size={11} />,
  Busy: <Clock size={11} />,
  Offline: <UserX size={11} />,
};

interface Props {
  technician: Technician;
  onAssign: (technicianId: string) => void;
  isAssigning: boolean;
}

export default function TechnicianAvailability({
  technician,
  onAssign,
  isAssigning,
}: Props) {
  const isAvailable = technician.availabilityStatus === "Available";

  return (
    <div className="rounded-2xl border border-[#C8A55E]/10 bg-[#0D0F14] p-4 flex flex-col gap-3">
      {/* Top row: avatar + name + availability */}
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#C8A55E]/30 to-[#818CF8]/20 flex items-center justify-center text-[#C8A55E] font-bold text-sm shrink-0">
          {technician.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#ECEDF0] truncate">
            {technician.name}
          </p>

          {/* Availability badge */}
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${AVAILABILITY_STYLES[technician.availabilityStatus]}`}
          >
            {AVAILABILITY_ICONS[technician.availabilityStatus]}
            {technician.availabilityStatus}
          </span>
        </div>

        {/* Rating */}
        
      </div>

      {/* Service categories */}
      <div className="flex flex-wrap gap-1.5">
        {technician.serviceCategories.map((cat) => (
          <span
            key={cat}
            className="rounded-md border border-[#C8A55E]/15 bg-[#C8A55E]/5 px-2 py-0.5 text-[10px] font-medium text-[#C8A55E]"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Workload */}
      <div className="flex items-center gap-1.5 text-xs text-[#9CA0AE]">
        <Briefcase size={11} />
        <span>
          {technician.currentWorkload === 0
            ? "No active jobs"
            : `${technician.currentWorkload} active job${technician.currentWorkload > 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Assign button */}
      <button
        onClick={() => onAssign(technician.id)}
        disabled={!isAvailable || isAssigning}
        className={`w-full rounded-xl py-2 text-xs font-bold transition ${
          isAvailable
            ? "bg-[#C8A55E] text-black hover:bg-[#E4D5A8]"
            : "cursor-not-allowed bg-[#1A1D28] text-[#5C6070]"
        }`}
      >
        {isAssigning ? "Assigning…" : isAvailable ? "Assign" : "Unavailable"}
      </button>
    </div>
  );
}
