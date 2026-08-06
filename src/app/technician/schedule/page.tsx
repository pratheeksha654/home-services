"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";
import { sortTechnicianJobs, type TechnicianJob } from "@/lib/technicianJobs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function TechnicianSchedulePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (value: string) => {
    if (!value) return "Emergency";

    const parsed = new Date(`1970-01-01T${value}`);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchJobs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        userId: user.id || "",
        email: user.email || "",
      });

      const res = await fetch(`${API_BASE}/technicians/jobs?${queryParams}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data?.jobs)) {
        setJobs(data.data.jobs);
      } else {
        setJobs([]);
        setError(data.message || "Unable to load your schedule right now.");
      }
    } catch (err) {
      console.error("Error fetching technician schedule:", err);
      setError("Unable to load your schedule right now.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user?.role === "TECHNICIAN_PENDING") {
      router.replace("/technician/pending");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (user && user.role === "TECHNICIAN") {
      fetchJobs();
    }
  }, [fetchJobs, user]);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d);
  };

  const selectedDateKey = selectedDate.toISOString().split("T")[0];

  const selectedDateSchedule = sortTechnicianJobs(jobs).filter(
    (item) => item.preferred_date === selectedDateKey
  );

  const completedJobs = useMemo(() => {
    return jobs
      .filter((item) => item.status === "Completed")
      .sort((left, right) => {
        const leftDate = new Date(`${left.preferred_date}T00:00:00`).getTime();
        const rightDate = new Date(`${right.preferred_date}T00:00:00`).getTime();
        return rightDate - leftDate;
      });
  }, [jobs]);

  const completedCount = jobs.filter((item) => item.status === "Completed").length;
  const inProgressCount = jobs.filter((item) => item.status === "In Progress").length;

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-8 pb-20 px-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C8A55E] border-t-transparent" />
        </div>
      </main>
    );
  }

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]/40 p-4">
            <p className="text-xs uppercase tracking-wider text-[#9CA0AE]">Total Tasks</p>
            <p className="mt-1 text-2xl font-bold text-white">{jobs.length}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]/40 p-4">
            <p className="text-xs uppercase tracking-wider text-[#9CA0AE]">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-amber-400">{inProgressCount}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]/40 p-4">
            <p className="text-xs uppercase tracking-wider text-[#9CA0AE]">Completed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{completedCount}</p>
          </div>
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

        {loading ? (
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]/40 p-10 text-center text-sm text-[#9CA0AE]">
            Loading your schedule…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* Timeline Schedule Cards */}
        <div className="space-y-4">
          {selectedDateSchedule.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[#14161E]/20 p-10 text-center text-sm text-[#9CA0AE]">
              No tasks scheduled for this date.
            </div>
          ) : (
            selectedDateSchedule.map((item) => (
            <div
              key={item.booking_id}
              className={`bg-[#14161E]/40 border p-6 rounded-2xl backdrop-blur-md transition-colors relative ${
                item.status === "In Progress"
                  ? "border-[rgba(200,165,94,0.4)] shadow-lg shadow-[#C8A55E]/5"
                  : "border-[rgba(255,255,255,0.06)]"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#C8A55E]" />
                  <span className="text-sm font-semibold text-[#ECEDF0]">
                    {formatTime(item.preferred_time)}
                  </span>
                </div>

                <div>
                  {item.status === "Completed" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                  {item.status === "In Progress" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full animate-pulse">
                      <Clock className="w-3.5 h-3.5" /> In Progress
                    </span>
                  )}
                  {item.status === "Pending" || item.status === "Assigned" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-[#9CA0AE] text-xs font-semibold rounded-full">
                      Scheduled
                    </span>
                  ) : null}
                </div>
              </div>

              <h2 className="text-xl font-bold text-white font-outfit mb-2">
                {item.service_category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#9CA0AE] mb-4">
                <div>
                  <span className="text-[#5C6070] font-medium">Customer: </span>
                  <span className="text-[#ECEDF0]">{item.customer_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#5C6070] shrink-0" />
                  <span className="text-[#ECEDF0]">{item.address}</span>
                </div>
              </div>

              <div className="bg-[#0A0B10]/60 p-3 rounded-xl border border-[rgba(255,255,255,0.03)] flex items-start gap-2 text-xs text-[#9CA0AE]">
                <AlertCircle className="w-4 h-4 text-[#C8A55E] shrink-0 mt-0.5" />
                <span>{item.problem_description}</span>
              </div>
            </div>
            ))
          )}
        </div>

        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-heading font-semibold text-white">
              Completed Tasks
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              {completedJobs.length}
            </span>
          </div>

          {completedJobs.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[#14161E]/20 p-10 text-center text-sm text-[#9CA0AE]">
              No completed tasks yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedJobs.map((item) => (
                <div
                  key={item.booking_id}
                  className="rounded-2xl border border-emerald-500/15 bg-[#14161E]/35 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-300">
                        {item.preferred_date}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {item.service_category} - {item.customer_name}
                      </h3>
                      <p className="mt-1 text-sm text-[#9CA0AE]">
                        {item.address}
                      </p>
                    </div>

                    <div className="text-sm text-[#9CA0AE] md:text-right">
                      <p className="font-semibold text-emerald-400">Completed</p>
                      <p>{formatTime(item.preferred_time)}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-[rgba(255,255,255,0.03)] bg-[#0A0B10]/60 p-3 text-xs text-[#9CA0AE]">
                    {item.problem_description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
