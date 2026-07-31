"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  Briefcase,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Play,
  KeyRound,
  X
} from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

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
  assigned_technician?: string;
}

export default function TechnicianDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Tracking State
  const [isSimulating, setIsSimulating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

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
      fetchJobs();
      const interval = setInterval(() => {
        if (!isSimulating) fetchJobs(); // Pause polling during simulation to avoid race conditions
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, fetchJobs, isSimulating]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/technicians/jobs/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.booking_id === bookingId ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Simulation Logic
  const toggleSimulation = async (bookingId: string) => {
    if (isSimulating) {
      // Stop Simulation
      setIsSimulating(false);
      if (simulationInterval.current) clearInterval(simulationInterval.current);
      return;
    }

    // Start Simulation
    setIsSimulating(true);
    let lat = 12.918;
    let lng = 77.605;
    let dist = 5.0;
    let eta = 15;
    let step = 0;

    // Send initial "On the Way" status
    await fetch(`${API_BASE}/technicians/jobs/${bookingId}/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat, lng, distanceKm: dist, etaMinutes: eta, status: "on_the_way", statusLabel: "On the Way"
      })
    });

    simulationInterval.current = setInterval(async () => {
      step++;
      lat += 0.0017;
      lng += 0.0019;
      dist = Math.max(0, dist - 0.5);
      eta = Math.max(0, eta - 1.5);

      let status = "on_the_way";
      let statusLabel = "On the Way";

      if (dist <= 0) {
        status = "reached";
        statusLabel = "Technician Reached";
      } else if (dist <= 1.5) {
        status = "arriving_soon";
        statusLabel = "Almost There! " + Math.ceil(eta) + " min away";
      } else {
        status = "on_the_way";
        statusLabel = "On the Way — " + dist.toFixed(1) + " km away";
      }

      try {
        await fetch(`${API_BASE}/technicians/jobs/${bookingId}/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat, lng, distanceKm: dist, etaMinutes: eta, status, statusLabel
          })
        });
      } catch (e) {
        console.error("Simulation tick error:", e);
      }

      if (dist <= 0) {
        // Arrived — stop simulation, show OTP
        setIsSimulating(false);
        clearInterval(simulationInterval.current!);
        setShowOtpModal(true);
      }
    }, 1500); // update every 1.5s — total trip ~15 seconds (10 ticks)
  };

  const handleVerifyOtp = async (bookingId: string) => {
    setVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE}/technicians/jobs/${bookingId}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpInput })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setShowOtpModal(false);
        setOtpInput("");
        handleUpdateStatus(bookingId, "In Progress"); // Update DB status
      } else {
        setOtpError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setOtpError("Failed to verify OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const todayStr = formatISO(new Date());
  const selectedStr = formatISO(selectedDate);
  const activeJob = jobs.find((j) => j.status === "In Progress" || j.status === "Assigned");
  const completedTodayCount = jobs.filter((j) => j.status === "Completed").length;
  const todayPendingJobs = jobs.filter(
    (j) => j.status === "Assigned" || j.status === "Pending" || j.status === "In Progress"
  );
  const selectedDateSchedule = jobs.filter(
    (j) => !selectedStr || j.preferred_date === selectedStr || j.status === "Assigned" || j.status === "In Progress"
  );

  const stats = [
    { label: "Today's Jobs", value: todayPendingJobs.length.toString(), icon: Clock, color: "text-amber-400" },
    { label: "Completed Today", value: completedTodayCount.toString(), icon: Briefcase, color: "text-emerald-400" },
    { label: "Total Assigned", value: jobs.length.toString(), icon: Wallet, color: "text-blue-400" },
  ];

  return (
    <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-8 pb-20 px-4 sm:px-8">
      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#14161E] rounded-3xl p-6 w-full max-w-sm border border-[rgba(255,255,255,0.1)] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-[#C8A55E]">
                  <KeyRound size={24} />
                  <h3 className="text-xl font-semibold text-white">Enter PIN</h3>
                </div>
                <button onClick={() => setShowOtpModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Ask the customer for their 4-digit arrival PIN to start the service.
              </p>
              
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#0A0B10] border border-[rgba(255,255,255,0.1)] rounded-xl py-4 text-center text-3xl tracking-[1em] font-semibold text-white mb-2 focus:outline-none focus:border-[#C8A55E]"
                placeholder="0000"
              />
              
              {otpError && <p className="text-red-400 text-sm text-center mb-4">{otpError}</p>}
              
              <button
                onClick={() => handleVerifyOtp(activeJob.booking_id)}
                disabled={otpInput.length !== 4 || verifyingOtp}
                className="w-full mt-4 bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] text-black font-bold py-3 rounded-xl disabled:opacity-50"
              >
                {verifyingOtp ? "Verifying..." : "Verify PIN"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Welcome Back, {user.name?.split(" ")[0] || "Technician"}!
            </h1>
            <p className="text-sm text-[#9CA0AE] mt-1 font-inter">
              Here is your live work order schedule & assigned orders.
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
            <section>
              <h2 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#C8A55E] rounded-full" />
                Current Active Order
              </h2>

              {activeJob ? (
                <div className="bg-gradient-to-br from-[#14161E]/80 to-[#0A0B10]/80 border border-[rgba(200,165,94,0.2)] p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/40">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A55E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white font-outfit">
                        {activeJob.customer_name}
                      </h3>
                      <p className="text-sm text-[#C8A55E] font-medium mt-1">
                        {activeJob.service_category}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full animate-pulse">
                      {activeJob.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#9CA0AE] mb-6 bg-[#0A0B10]/50 p-3 rounded-xl border border-[rgba(255,255,255,0.03)]">
                    <strong className="text-white font-semibold">Issue: </strong>
                    {activeJob.problem_description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#9CA0AE] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#ECEDF0]">{activeJob.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#9CA0AE] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#ECEDF0]">Date: {activeJob.preferred_date}</p>
                        <p className="text-xs text-[#5C6070] mt-0.5">Time: {activeJob.preferred_time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Control Bar */}
                  {activeJob.status === "Assigned" && (
                    <div className="bg-[#0A0B10]/80 border border-indigo-500/30 p-4 rounded-xl mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Live Tracking</p>
                          <p className="text-xs text-gray-400">Share your location with customer</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSimulation(activeJob.booking_id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                            isSimulating 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                          }`}
                        >
                          {isSimulating ? "Stop Simulating" : <><Play className="w-4 h-4" /> Start Trip (Sim)</>}
                        </button>
                        <button
                          onClick={() => setShowOtpModal(true)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                        >
                          Arrived (OTP)
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${activeJob.phone}`}
                      className="flex items-center gap-2 bg-[#0A0B10]/80 hover:bg-[#1A1D28] text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-[rgba(255,255,255,0.06)] transition-all"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      Call ({activeJob.phone})
                    </a>
                    {activeJob.status === "In Progress" && (
                      <button
                        disabled={updatingId === activeJob.booking_id}
                        onClick={() => handleUpdateStatus(activeJob.booking_id, "Completed")}
                        className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] text-[#08090D] hover:shadow-lg hover:shadow-[#C8A55E]/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        {updatingId === activeJob.booking_id ? "Updating..." : "Mark Completed"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#14161E]/20 border border-dashed border-[rgba(255,255,255,0.08)] p-8 rounded-2xl text-center">
                  <Clock className="w-10 h-10 text-[#5C6070] mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white">No active orders right now</h3>
                  <p className="text-xs text-[#9CA0AE] mt-1">
                    When a coordinator assigns work to you, it will show up here immediately.
                  </p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
                Today's Assigned Orders
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{job.customer_name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8A55E]/10 text-[#C8A55E]">
                            {job.service_category}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA0AE] mt-1">{job.address}</p>
                        <p className="text-xs text-[#5C6070] mt-0.5">Time: {job.preferred_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

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
