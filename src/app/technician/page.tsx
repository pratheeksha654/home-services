"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  Briefcase,
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Booking {
  booking_id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_category: string;
  problem_description: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  booking_type: string;
  status: string;
  priority?: string;
  assigned_technician?: string;
}

export default function TechnicianDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user?.role !== "TECHNICIAN") {
      if (user?.role === "TECHNICIAN_PENDING") {
        router.replace("/technician/pending");
      }
    }
  }, [user, isLoading, router]);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoadingJobs(true);
    try {
      const queryParams = new URLSearchParams({
        userId: user.id || "",
        email: user.email || "",
      });
      const res = await fetch(`${API_BASE}/technicians/jobs?${queryParams}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data?.jobs)) {
        setJobs(data.data.jobs);
      }
    } catch (err) {
      console.error("Error fetching technician jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "TECHNICIAN") {
      const initialLoad = window.setTimeout(() => {
        void fetchJobs();
      }, 0);
      const interval = setInterval(() => {
        fetchJobs();
      }, 10000);
      return () => {
        window.clearTimeout(initialLoad);
        clearInterval(interval);
      };
    }
  }, [user, fetchJobs]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const todayStr = formatISO(new Date());
  const selectedStr = formatISO(selectedDate);

  // Only today's non-completed, non-cancelled jobs — avoids duplicates from other dates
  const todayPendingJobs = jobs.filter(
    (j) =>
      j.preferred_date === todayStr &&
      (j.status === "Assigned" || j.status === "Pending" || j.status === "In Progress")
  );

  const completedTodayCount = jobs.filter(
    (j) => j.status === "Completed" && j.preferred_date === todayStr
  ).length;

  // All active jobs across all dates (for the CTA card counter)
  const allActiveJobs = jobs.filter(
    (j) => j.status === "Assigned" || j.status === "Pending" || j.status === "In Progress"
  );
  const emergencyActiveCount = allActiveJobs.filter((j) => j.booking_type === "Emergency").length;

  const selectedDateSchedule = jobs.filter(
    (j) => !selectedStr || j.preferred_date === selectedStr
  );

  const stats = [
    { label: "Today's Jobs", value: todayPendingJobs.length.toString(), icon: Clock, color: "text-amber-400" },
    { label: "Completed Today", value: completedTodayCount.toString(), icon: Briefcase, color: "text-emerald-400" },
    { label: "Total Assigned", value: jobs.length.toString(), icon: Wallet, color: "text-blue-400" },
  ];

  return (
    <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-8 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Welcome Back, {user.name?.split(" ")[0] || "Technician"}!
            </h1>
            <p className="text-sm text-[#9CA0AE] mt-1 font-inter">
              Here is your live work order schedule &amp; assigned orders.
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-2 bg-[#14161E] hover:bg-[#1A1D28] text-[#9CA0AE] hover:text-white px-4 py-2 rounded-xl text-sm font-medium border border-[rgba(255,255,255,0.06)] transition-all self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loadingJobs ? "animate-spin" : ""}`} />
            Refresh Orders
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] p-5 rounded-2xl backdrop-blur-md flex items-center gap-4 hover:bg-[#14161E]/60 transition-colors"
              >
                <div className="p-3 bg-[#0A0B10]/80 rounded-xl border border-[rgba(255,255,255,0.03)]">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-[#9CA0AE] font-inter uppercase tracking-wider font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-white font-outfit mt-0.5">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* ── Active Jobs CTA Card ────────────────────────────────── */}
            <section>
              <h2 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#C8A55E] rounded-full" />
                Active Jobs
              </h2>

              <div
                className="relative overflow-hidden bg-gradient-to-br from-[#14161E]/90 via-[#0F1017]/90 to-[#08090D]/90 border border-[rgba(200,165,94,0.22)] rounded-2xl p-6 backdrop-blur-md shadow-xl shadow-black/40 cursor-pointer group transition-all hover:border-[rgba(200,165,94,0.4)] hover:shadow-2xl hover:shadow-[#C8A55E]/5"
                onClick={() => router.push("/technician/activejobs")}
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8A55E]/4 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#C8A55E]/8 transition-all" />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-gradient-to-br from-[#C8A55E]/20 to-[#C8A55E]/5 border border-[#C8A55E]/20 rounded-2xl">
                      <Zap className="w-7 h-7 text-[#C8A55E]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-outfit">
                        {allActiveJobs.length > 0
                          ? `${allActiveJobs.length} Active Job${allActiveJobs.length !== 1 ? "s" : ""}`
                          : "No Active Jobs"}
                      </h3>
                      <p className="text-sm text-[#9CA0AE] mt-0.5">
                        {allActiveJobs.length > 0
                          ? "Emergency jobs are prioritized at the top"
                          : "No pending or assigned jobs right now"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 p-2.5 bg-[#0A0B10]/60 border border-[rgba(255,255,255,0.06)] rounded-xl group-hover:bg-[#C8A55E]/10 group-hover:border-[#C8A55E]/20 transition-all">
                    <ArrowRight className="w-5 h-5 text-[#9CA0AE] group-hover:text-[#C8A55E] transition-colors" />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-5 relative z-10">
                  {emergencyActiveCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {emergencyActiveCount} Emergency
                    </span>
                  )}
                  {(allActiveJobs.length - emergencyActiveCount) > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {allActiveJobs.length - emergencyActiveCount} Normal
                    </span>
                  )}
                  {allActiveJobs.length === 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D28]/60 border border-[rgba(255,255,255,0.06)] text-[#5C6070] text-xs font-semibold rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      All clear for now
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A55E]/10 border border-[#C8A55E]/20 text-[#C8A55E] text-xs font-bold rounded-full group-hover:bg-[#C8A55E]/20 transition-all">
                    Open Active Jobs
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </section>

            {/* ── Today's Assigned Orders ─────────────────────────────── */}
            <section>
              <h2 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
                Today&apos;s Assigned Orders
              </h2>
              {todayPendingJobs.length === 0 ? (
                <div className="bg-[#14161E]/20 border border-[rgba(255,255,255,0.04)] p-6 rounded-2xl text-center text-sm text-[#9CA0AE]">
                  No pending orders assigned for today ({todayStr}).
                </div>
              ) : (
                <div className="space-y-3">
                  {todayPendingJobs.map((job) => (
                    <div
                      key={job.booking_id}
                      className="bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white">{job.customer_name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8A55E]/10 text-[#C8A55E]">
                            {job.service_category}
                          </span>
                          {job.booking_type === "Emergency" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                              Emergency
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9CA0AE] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {job.address}
                        </p>
                        <p className="text-xs text-[#5C6070] mt-0.5">
                          Time: {job.preferred_time}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${
                          job.status === "In Progress"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : job.status === "Assigned"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-slate-500/10 text-slate-300 border border-slate-500/20"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Sidebar: Scheduled Day ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <section className="bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] p-6 rounded-2xl backdrop-blur-md sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-white">
                  Scheduled Day
                </h2>
                <Calendar className="w-5 h-5 text-[#C8A55E]" />
              </div>

              <div className="flex items-center justify-between mb-6 bg-[#0A0B10]/60 p-2 rounded-xl border border-[rgba(255,255,255,0.03)]">
                <button
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 1);
                    setSelectedDate(d);
                  }}
                  className="p-1.5 hover:bg-[#1A1D28] rounded-lg transition-colors text-[#9CA0AE] hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-[#ECEDF0] font-outfit">
                  {formatDate(selectedDate)}
                </span>
                <button
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d);
                  }}
                  className="p-1.5 hover:bg-[#1A1D28] rounded-lg transition-colors text-[#9CA0AE] hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedDateSchedule.length === 0 ? (
                  <p className="text-xs text-center text-[#5C6070] py-4">
                    No bookings scheduled for this date.
                  </p>
                ) : (
                  selectedDateSchedule.map((slot) => (
                    <div key={slot.booking_id} className="relative pl-6">
                      <div
                        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-[#14161E] ${
                          slot.status === "Completed"
                            ? "bg-emerald-500"
                            : slot.status === "In Progress"
                            ? "bg-amber-400"
                            : slot.booking_type === "Emergency"
                            ? "bg-red-500"
                            : "bg-blue-400"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold text-[#5C6070] mb-1">
                          {slot.preferred_time}
                        </p>
                        <div className="p-3 rounded-xl border bg-[#0A0B10]/40 border-[rgba(255,255,255,0.03)]">
                          <p className={`text-sm font-medium ${slot.status === "Completed" ? "text-[#9CA0AE] line-through" : "text-[#ECEDF0]"}`}>
                            {slot.service_category} - {slot.customer_name}
                          </p>
                          <span className="text-[10px] text-[#C8A55E] uppercase tracking-wider font-semibold">
                            {slot.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8">
                <GlassButton variant="secondary" fullWidth onClick={() => router.push("/technician/schedule")}>
                  View Full Schedule
                </GlassButton>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
