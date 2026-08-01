"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Wrench,
  FileText,
  Calendar,
  Users,
} from "lucide-react";
import type { EmergencyRequest, Technician } from "@/app/types/coordinator";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import TechnicianAvailability from "./TechnicianAvailability";

interface Props {
  request: EmergencyRequest;
  matchingTechnicians: Technician[];
  onAssign: (requestId: string, technicianId: string) => void;
  onReject?: (requestId: string) => void;
}

function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function EmergencyRequestCard({
  request,
  matchingTechnicians,
  onAssign,
}: Props) {
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const handleAssign = (technicianId: string) => {
    setAssigningId(technicianId);
    // Simulates async API call: PATCH /api/emergency-requests/:id/assign
    setTimeout(() => {
      onAssign(request.id, technicianId);
      setAssigningId(null);
    }, 600);
  };

  const isResolved =
    request.status === "Resolved" || request.status === "Assigned";

  return (
    <article className="rounded-3xl border border-[#C8A55E]/10 bg-[#151922] overflow-hidden">
      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/5 px-6 py-5">
        <div className="flex items-center gap-3">
          {/* Emergency icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/15">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-xs font-mono text-[#5C6070]">{request.id}</p>
            <p className="text-base font-bold text-[#ECEDF0]">
              {request.customerName}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>

      {/* Card Body */}
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-2">
        {/* ── Left: Request Details ── */}
        <div className="space-y-4">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone size={15} className="mt-0.5 shrink-0 text-[#C8A55E]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6070]">
                Phone Number
              </p>
              <p className="mt-0.5 text-sm text-[#ECEDF0]">
                {request.phoneNumber}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#C8A55E]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6070]">
                Address
              </p>
              <p className="mt-0.5 text-sm text-[#ECEDF0]">
                {request.address}
              </p>
            </div>
          </div>

          {/* Service Category */}
          <div className="flex items-start gap-3">
            <Wrench size={15} className="mt-0.5 shrink-0 text-[#C8A55E]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6070]">
                Service Category
              </p>
              <p className="mt-0.5 text-sm text-[#ECEDF0]">
                {request.serviceCategory}
              </p>
            </div>
          </div>

          {/* Submitted At */}
          <div className="flex items-start gap-3">
            <Calendar size={15} className="mt-0.5 shrink-0 text-[#C8A55E]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6070]">
                Submitted
              </p>
              <p className="mt-0.5 text-sm text-[#ECEDF0]">
                {formatDateTime(request.submittedAt)}
              </p>
            </div>
          </div>

          {/* Problem Description */}
          <div className="flex items-start gap-3">
            <FileText size={15} className="mt-0.5 shrink-0 text-[#C8A55E]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6070]">
                Problem Description
              </p>
              <p className="mt-0.5 text-sm leading-6 text-[#9CA0AE]">
                {request.problemDescription}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Available Technicians ── */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Users size={15} className="text-[#C8A55E]" />
            <p className="text-sm font-semibold text-[#ECEDF0]">
              Available Technicians
            </p>
            <span className="rounded-full bg-[#C8A55E]/10 px-2 py-0.5 text-[10px] font-bold text-[#C8A55E]">
              {matchingTechnicians.length}
            </span>
          </div>

          {isResolved ? (
            <div className="rounded-2xl border border-white/5 bg-[#0D0F14] p-5 text-center">
              <p className="text-sm text-[#5C6070]">
                {request.status === "Resolved"
                  ? "This request has been resolved."
                  : "A technician has already been assigned to this request."}
              </p>
            </div>
          ) : matchingTechnicians.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#0D0F14] p-5 text-center">
              <p className="text-sm text-[#5C6070]">
                No technicians found for this service category.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {(matchingTechnicians || []).map((tech) => (
                <TechnicianAvailability
                  key={tech.id}
                  technician={tech}
                  onAssign={handleAssign}
                  isAssigning={assigningId === tech.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
