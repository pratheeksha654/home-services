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
  X,
  Sparkles
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
  const [isTracking, setIsTracking] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState<string | null>(null);
  const [completionSent, setCompletionSent] = useState(false);
  const [acknowledgedJobs, setAcknowledgedJobs] = useState<string[]>([]);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedJobDetails, setCompletedJobDetails] = useState<Booking | null>(null);

  const handleFinishWork = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      await fetch(`${API_BASE}/tracking/${bookingId}/request-completion`, { method: "POST" });
      setCompletionSent(true);
    } catch (e) {
      console.error("Error requesting completion:", e);
    } finally {
      setUpdatingId(null);
    }
  };
  const watchId = useRef<number | null>(null);

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
        if (!isTracking) fetchJobs(); // Pause polling during tracking to avoid race conditions
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, fetchJobs, isTracking]);

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

  // Sync Polling - detects customer actions and auto-updates technician UI
  useEffect(() => {
    const activeJob = jobs.find((j) => j.status === "In Progress" || j.status === "Assigned");
    if (!activeJob) return;

    const pollTracking = async () => {
      try {
        const res = await fetch(`${API_BASE}/tracking/${activeJob.booking_id}`);
        const data = await res.json();
        if (data.success && data.data?.tracking) {
          const status = data.data.tracking.currentStatus;
          setSyncedStatus(status);

          if (data.data.tracking.completionRequested) {
            setCompletionSent(true);
          } else {
            setCompletionSent(false);
          }
          
          // Auto-update DB status if customer confirmed arrival
          if (status === 'service_in_progress' && activeJob.status === 'Assigned') {
            handleUpdateStatus(activeJob.booking_id, "In Progress");
          }
          
          // Auto-update DB status if customer confirmed completion
          if (status === 'completed' && activeJob.status !== 'Completed') {
            await handleUpdateStatus(activeJob.booking_id, "Completed");
            setCompletedJobDetails(activeJob);
            setShowCompletedModal(true);
            setCompletionSent(false);
          }
        }
      } catch (err) {
        console.error("Error polling tracking:", err);
      }
    };

    pollTracking();
    const interval = setInterval(pollTracking, 2500);
    return () => clearInterval(interval);
  }, [jobs]);

  const handleStartTrip = async (bookingId: string) => {
    try {
      await fetch(`${API_BASE}/tracking/${bookingId}/start-trip`, { method: "POST" });
      setSyncedStatus("ready_to_leave");
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          await fetch(`${API_BASE}/tracking/${bookingId}/location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              distanceKm: 5.0,
              etaMinutes: 15
            })
          });
        });
      }
    } catch (e) {
      console.error("Error starting trip:", e);
    }
  };

  const handleStartDriving = async (bookingId: string) => {
    try {
      await fetch(`${API_BASE}/tracking/${bookingId}/start-driving`, { method: "POST" });
      setSyncedStatus("on_the_way");
      setIsTracking(true);

      if (navigator.geolocation) {
        watchId.current = navigator.geolocation.watchPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            try {
              await fetch(`${API_BASE}/tracking/${bookingId}/location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lat: latitude,
                  lng: longitude,
                  distanceKm: 2.5,
                  etaMinutes: 8
                })
              });
            } catch (err) {
              console.error("Error updating location:", err);
            }
          },
          (err) => console.error("Geolocation error:", err),
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    } catch (e) {
      console.error("Error starting driving:", e);
    }
  };

  const handleMarkReached = async (bookingId: string) => {
    try {
      await fetch(`${API_BASE}/tracking/${bookingId}/reach`, { method: "POST" });
      setSyncedStatus("reached");
      setIsTracking(false);

      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    } catch (e) {
      console.error("Error marking reached:", e);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

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
  const lastCompletedJob = jobs.find((j) => j.status === "Completed" && !acknowledgedJobs.includes(j.booking_id));
  const completedTodayCount = jobs.filter((j) => j.status === "Completed").length;
  const todayPendingJobs = jobs.filter(
    (j) => j.status === "Assigned" || j.status === "Pending" || j.status === "In Progress"
  );
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
                    <div className="bg-[#0A0B10]/80 border border-indigo-500/30 p-4 rounded-xl mb-6 shadow-lg shadow-indigo-950/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                            <Navigation className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">Live Tracking Workflow</p>
                            <p className="text-xs text-gray-400">
                              {syncedStatus === 'ready_to_leave' 
                                ? 'Technician is ready to leave. Tap below to start driving.' 
                                : syncedStatus === 'on_the_way' 
                                ? 'Currently driving. Streaming live coordinates to customer.' 
                                : syncedStatus === 'reached'
                                ? 'Reached location. Waiting for customer to confirm.'
                                : 'Ready to head out? Start GPS to let the customer know.'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          {(!syncedStatus || syncedStatus === 'assigned') && (
                            <button
                              onClick={() => handleStartTrip(activeJob.booking_id)}
                              className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                              <span>1. Ready to Leave</span>
                            </button>
                          )}

                          {syncedStatus === 'ready_to_leave' && (
                            <button
                              onClick={() => handleStartDriving(activeJob.booking_id)}
                              className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                              <span>2. Start Driving (GPS)</span>
                            </button>
                          )}

                          {syncedStatus === 'on_the_way' && (
                            <button
                              onClick={() => handleMarkReached(activeJob.booking_id)}
                              className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                              <span>3. Mark as Reached</span>
                            </button>
                          )}

                          {syncedStatus === 'reached' && (
                            <div className="flex flex-col gap-2 w-full">
                              <div className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse w-full justify-center">
                                <Clock size={12} />
                                Awaiting customer to verify arrival...
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    await fetch(`${API_BASE}/tracking/${activeJob.booking_id}/confirm-arrival`, { method: 'POST' });
                                    setSyncedStatus('service_in_progress');
                                    handleUpdateStatus(activeJob.booking_id, "In Progress");
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95 cursor-pointer w-full text-center flex items-center justify-center gap-1.5"
                              >
                                <Play size={12} />
                                <span>Start Service</span>
                              </button>
                            </div>
                          )}
                        </div>
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
                      completionSent ? (
                        <div className="ml-auto bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-xl text-amber-400 text-sm font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          Waiting for Customer to Confirm Completion...
                        </div>
                      ) : (
                        <button
                          disabled={updatingId === activeJob.booking_id}
                          onClick={() => handleFinishWork(activeJob.booking_id)}
                          className="ml-auto flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:shadow-lg hover:shadow-emerald-500/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          {updatingId === activeJob.booking_id ? "Sending..." : "Finish Work & Request Confirmation"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : lastCompletedJob ? (
                <div className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-[#0A0B10]/80 border border-emerald-500/40 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-2xl shadow-emerald-950/50">
                  <button 
                    onClick={() => setAcknowledgedJobs(prev => [...prev, lastCompletedJob.booking_id])}
                    className="absolute top-4 right-4 p-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Acknowledge & Clear"
                  >
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold font-inter">Clear Task</span>
                  </button>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <CheckCircle2 size={26} className="animate-bounce" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
                        Task Done!
                      </span>
                      <h3 className="text-xl font-bold text-white font-outfit mt-1">
                        Service Completed
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-200/90 bg-[#0A0B10]/50 p-4 rounded-xl border border-emerald-500/20 mt-2">
                    Order for <strong className="text-white font-semibold">{lastCompletedJob.customer_name}</strong> ({lastCompletedJob.service_category}) has been verified & marked completed by customer. Great work!
                  </p>
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
                  {(todayPendingJobs || []).map((job) => (
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
                  (selectedDateSchedule || []).map((slot) => (
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

      {showCompletedModal && completedJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090D]/80 backdrop-blur-md px-4">
          <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-indigo-950/60 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
              <CheckCircle2 size={36} className="animate-bounce" />
            </div>

            <h3 className="text-2xl font-bold text-white font-outfit">Task Completed!</h3>
            <p className="text-sm text-indigo-200/80 mt-2 mb-6">
              Customer <strong className="text-white">{completedJobDetails.customer_name}</strong> has confirmed completion of the <strong className="text-white">{completedJobDetails.service_category}</strong> service.
            </p>

            <button
              onClick={() => {
                setAcknowledgedJobs(prev => [...prev, completedJobDetails.booking_id]);
                setShowCompletedModal(false);
                setCompletedJobDetails(null);
                fetchJobs();
              }}
              className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/30"
            >
              <Sparkles size={16} />
              <span>Acknowledge & Load Next Task</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
