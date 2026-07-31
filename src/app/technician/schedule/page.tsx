"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const mockFullSchedule = [
  {
    id: 1,
    time: "09:00 AM - 10:30 AM",
    service: "AC General Maintenance",
    customer: "John Doe",
    location: "45 Palm Street, Suite 4B",
    status: "COMPLETED",
    notes: "Coordinator note: Priority client. Clean filter replaced.",
  },
  {
    id: 2,
    time: "11:30 AM - 01:00 PM",
    service: "Electrical Wiring Inspection",
    customer: "Sarah Jenkins",
    location: "124 Main St",
    status: "IN_PROGRESS",
    notes: "Coordinator note: Main circuit box check required.",
  },
  {
    id: 3,
    time: "02:30 PM - 04:00 PM",
    service: "Plumbing Pipe Repair",
    customer: "Michael Brown",
    location: "88 Ocean Drive",
    status: "UPCOMING",
    notes: "Coordinator note: Underground leak inspection.",
  },
  {
    id: 4,
    time: "05:00 PM - 06:30 PM",
    service: "Water Heater Installation",
    customer: "Emily Davis",
    location: "12 Sunset Ave",
    status: "UPCOMING",
    notes: "Coordinator note: New unit delivered on-site.",
  },
];

export default function TechnicianSchedulePage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d);
  };

  return (
    <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-8 pb-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">
              Assigned Job Schedule
            </h1>
            <p className="text-sm text-[#9CA0AE] mt-1">
              View your coordinator-assigned tasks and timeline.
            </p>
          </div>
          <Link
            href="/technician"
            className="text-xs font-semibold text-[#C8A55E] hover:text-[#E4D5A8] transition-colors self-start sm:self-auto"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Date Selector Header */}
        <div className="bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] p-4 rounded-2xl backdrop-blur-md flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0A0B10]/80 hover:bg-[#1A1D28] text-sm text-[#9CA0AE] hover:text-white rounded-xl border border-[rgba(255,255,255,0.06)] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Day
          </button>

          <div className="flex items-center gap-2 text-center">
            <CalendarIcon className="w-5 h-5 text-[#C8A55E]" />
            <span className="text-base sm:text-lg font-bold text-white font-outfit">
              {formatDate(selectedDate)}
            </span>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0A0B10]/80 hover:bg-[#1A1D28] text-sm text-[#9CA0AE] hover:text-white rounded-xl border border-[rgba(255,255,255,0.06)] transition-all"
          >
            Next Day
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Schedule Cards */}
        <div className="space-y-4">
          {mockFullSchedule.map((item) => (
            <div
              key={item.id}
              className={`bg-[#14161E]/40 border p-6 rounded-2xl backdrop-blur-md transition-colors relative ${
                item.status === "IN_PROGRESS"
                  ? "border-[rgba(200,165,94,0.4)] shadow-lg shadow-[#C8A55E]/5"
                  : "border-[rgba(255,255,255,0.06)]"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#C8A55E]" />
                  <span className="text-sm font-semibold text-[#ECEDF0]">
                    {item.time}
                  </span>
                </div>

                <div>
                  {item.status === "COMPLETED" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                  {item.status === "IN_PROGRESS" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full animate-pulse">
                      <Clock className="w-3.5 h-3.5" /> In Progress
                    </span>
                  )}
                  {item.status === "UPCOMING" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-[#9CA0AE] text-xs font-semibold rounded-full">
                      Scheduled
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-white font-outfit mb-2">
                {item.service}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#9CA0AE] mb-4">
                <div>
                  <span className="text-[#5C6070] font-medium">Customer: </span>
                  <span className="text-[#ECEDF0]">{item.customer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#5C6070] shrink-0" />
                  <span className="text-[#ECEDF0]">{item.location}</span>
                </div>
              </div>

              <div className="bg-[#0A0B10]/60 p-3 rounded-xl border border-[rgba(255,255,255,0.03)] flex items-start gap-2 text-xs text-[#9CA0AE]">
                <AlertCircle className="w-4 h-4 text-[#C8A55E] shrink-0 mt-0.5" />
                <span>{item.notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
