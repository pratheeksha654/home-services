"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2, Clock, MapPin, Navigation, Phone, Play, RefreshCw, Wrench } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type TechnicianJob = {
  booking_id: string;
  customer_name: string;
  phone?: string;
  service_category: string;
  problem_description: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  booking_type: string;
  status: string;
  priority?: string;
};

const TIME_SLOT_REGEX = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;

const parseTime = (value: string) => {
  if (!value || value === "Emergency") return Number.MAX_SAFE_INTEGER;
  const match = value.match(TIME_SLOT_REGEX);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return Number.MAX_SAFE_INTEGER;
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const sortJobs = (left: TechnicianJob, right: TechnicianJob) => {
  const dateComparison = left.preferred_date.localeCompare(right.preferred_date);
  if (dateComparison !== 0) return dateComparison;

  const leftEmergency = left.booking_type === "Emergency";
  const rightEmergency = right.booking_type === "Emergency";
  if (leftEmergency !== rightEmergency) return leftEmergency ? -1 : 1;

  if (leftEmergency && rightEmergency) {
    const priorityOrder: Record<string, number> = { Critical: 1, High: 2, Medium: 3, Low: 4 };
    return (priorityOrder[left.priority || "Low"] || 99) - (priorityOrder[right.priority || "Low"] || 99);
  }

  return parseTime(left.preferred_time) - parseTime(right.preferred_time);
};

export default function ActiveJobsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const watchId = useRef<number | null>(null);

  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState<string | null>(null);
  const [completionSent, setCompletionSent] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        userId: user.id || "",
        email: user.email || "",
      });

      const res = await fetch(`${API_BASE}/technicians/jobs?${query}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data?.jobs)) {
       const newJobs = data.data.jobs;

setJobs((prev) => {
  if (JSON.stringify(prev) === JSON.stringify(newJobs)) {
    return prev;
  }
  return newJobs;
});
      } else {
        setJobs([]);
        setError(data.message || "Unable to load jobs.");
      }
    } catch (err) {
      console.error("Error fetching technician jobs:", err);
      setJobs([]);
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }

    if (!isLoading && user?.role?.toUpperCase() === "TECHNICIAN_PENDING") {
      router.replace("/technician/pending");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (user?.role?.toUpperCase() !== "TECHNICIAN") return;

    void fetchJobs();
    const interval = window.setInterval(() => {
  void fetchJobs();
}, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchJobs, user]);

  const orderedJobs = useMemo(() => [...jobs].sort(sortJobs), [jobs]);
  const activeJobs = useMemo(
    () => orderedJobs.filter((job) => job.status === "Assigned" || job.status === "Pending" || job.status === "In Progress"),
    [orderedJobs]
  );
  const activeJob = activeJobs[0] || null;
  const completedJobs = useMemo(() => jobs.filter((job) => job.status === "Completed"), [jobs]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/technicians/jobs/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setJobs((prev) => prev.map((job) => (job.booking_id === bookingId ? { ...job, status: newStatus } : job)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const current = activeJob;
    if (!current) {
      setSyncedStatus(null);
      setCompletionSent(false);
      return;
    }

    const pollTracking = async () => {
      try {
        const res = await fetch(`${API_BASE}/tracking/${current.booking_id}`);
        const data = await res.json();

        if (data.success && data.data?.tracking) {
          const status = data.data.tracking.currentStatus;
          setSyncedStatus((prev) => prev === status ? prev : status);

          const completed = Boolean(data.data.tracking.completionRequested);
          setCompletionSent((prev) => prev === completed ? prev : completed);

          if (status === "service_in_progress" && current.status === "Assigned") {
            await handleUpdateStatus(current.booking_id, "In Progress");
          }

          if (status === "completed" && current.status !== "Completed") {
            await handleUpdateStatus(current.booking_id, "Completed");
          }
        }
      } catch (err) {
        console.error("Error polling tracking:", err);
      }
    };

    void pollTracking();
    const interval = window.setInterval(() => {
      void pollTracking();
    }, 2500);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeJob]);

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
              distanceKm: 5,
              etaMinutes: 15,
            }),
          });
        });
      }
    } catch (err) {
      console.error("Error starting trip:", err);
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
            try {
              await fetch(`${API_BASE}/tracking/${bookingId}/location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  distanceKm: 2.5,
                  etaMinutes: 8,
                }),
              });
            } catch (err) {
              console.error("Error updating location:", err);
            }
          },
          (err) => console.error("Geolocation error:", err),
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    } catch (err) {
      console.error("Error starting driving:", err);
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
    } catch (err) {
      console.error("Error marking reached:", err);
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
      <main className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C8A55E] border-t-transparent" />
      </main>
    );
  }

  const completedCount = completedJobs.length;
  const inProgressCount = jobs.filter((job) => job.status === "In Progress").length;

  return (
    <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-8 pb-20 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">Active Jobs</h1>
            <p className="mt-1 text-[#9CA0AE]">View current live tracking and active bookings in one place.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/technician" className="text-[#C8A55E] font-semibold">
              Dashboard
            </Link>
            <button onClick={fetchJobs} className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#14161E]/50 px-4 py-2 text-sm text-[#9CA0AE] transition hover:bg-[#1A1D28] hover:text-white">
              <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-[#14161E]/50 p-5">
            <p className="text-xs uppercase text-[#9CA0AE]">Active Jobs</p>
            <h2 className="mt-2 text-3xl font-bold">{activeJobs.length}</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#14161E]/50 p-5">
            <p className="text-xs uppercase text-[#9CA0AE]">In Progress</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">{inProgressCount}</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#14161E]/50 p-5">
            <p className="text-xs uppercase text-[#9CA0AE]">Completed</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">{completedCount}</h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-[#14161E]/40 p-10 text-center text-[#9CA0AE]">Loading...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-500/10 p-6 text-red-200 border border-red-500/20">{error}</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <div className="h-6 w-1.5 rounded-full bg-[#C8A55E]" />
                Current Active Order
              </h2>

              {activeJob ? (
                <article className="rounded-3xl border border-[rgba(200,165,94,0.22)] bg-[#14161E]/80 p-6 shadow-2xl shadow-black/40">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeJob.customer_name}</h3>
                      <p className="mt-1 text-sm text-[#C8A55E]">{activeJob.service_category} · {activeJob.booking_type}</p>
                    </div>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 animate-pulse">
                      {activeJob.status}
                    </span>
                  </div>

                  <p className="mb-6 rounded-xl border border-white/5 bg-[#0A0B10]/60 p-3 text-sm text-[#9CA0AE]">
                    <strong className="text-white">Issue: </strong>
                    {activeJob.problem_description}
                  </p>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#9CA0AE]" />
                      <p className="text-sm text-[#ECEDF0]">{activeJob.address}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#9CA0AE]" />
                      <div>
                        <p className="text-sm text-[#ECEDF0]">Date: {activeJob.preferred_date}</p>
                        <p className="text-xs text-[#5C6070]">Time: {activeJob.preferred_time}</p>
                      </div>
                    </div>
                  </div>

                  {activeJob.status === "Assigned" && (
                    <div className="mb-6 rounded-xl border border-indigo-500/30 bg-[#0A0B10]/80 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                            <Navigation className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">Live Tracking Workflow</p>
                            <p className="text-xs text-gray-400">
                              {syncedStatus === "ready_to_leave"
                                ? "Ready to leave. Start driving to begin GPS tracking."
                                : syncedStatus === "on_the_way"
                                  ? "Currently driving. Coordinates are being streamed."
                                  : syncedStatus === "reached"
                                    ? "Reached location. Waiting for customer confirmation."
                                    : "Start GPS tracking when you are ready to leave."}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full justify-end gap-2 sm:w-auto">
                          {(!syncedStatus || syncedStatus === "assigned") && (
                            <button
                              onClick={() => handleStartTrip(activeJob.booking_id)}
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500"
                            >
                              1. Ready to Leave
                            </button>
                          )}

                          {syncedStatus === "ready_to_leave" && (
                            <button
                              onClick={() => handleStartDriving(activeJob.booking_id)}
                              className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-500"
                            >
                              2. Start Driving (GPS)
                            </button>
                          )}

                          {syncedStatus === "on_the_way" && (
                            <button
                              onClick={() => handleMarkReached(activeJob.booking_id)}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
                            >
                              3. Mark as Reached
                            </button>
                          )}

                          {syncedStatus === "reached" && (
                            <div className="flex w-full flex-col gap-2">
                              <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 animate-pulse">
                                <Clock size={12} />
                                Awaiting customer to verify arrival...
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    await fetch(`${API_BASE}/tracking/${activeJob.booking_id}/confirm-arrival`, { method: "POST" });
                                    setSyncedStatus("service_in_progress");
                                    await handleUpdateStatus(activeJob.booking_id, "In Progress");
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500"
                              >
                                <Play size={12} />
                                Start Service
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${activeJob.phone || ""}`}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#0A0B10]/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A1D28]"
                    >
                      <Phone className="h-4 w-4 text-emerald-400" />
                      Call Customer
                    </a>

                    {activeJob.status === "In Progress" &&
                      (completionSent ? (
                        <div className="ml-auto flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-400">
                          <Clock className="h-4 w-4 animate-spin" />
                          Waiting for Customer to Confirm Completion...
                        </div>
                      ) : (
                        <button
                          disabled={updatingId === activeJob.booking_id}
                          onClick={async () => {
                            setUpdatingId(activeJob.booking_id);
                            try {
                              await fetch(`${API_BASE}/tracking/${activeJob.booking_id}/request-completion`, { method: "POST" });
                              setCompletionSent(true);
                            } catch (err) {
                              console.error("Error requesting completion:", err);
                            } finally {
                              setUpdatingId(null);
                            }
                          }}
                          className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-black transition active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          {updatingId === activeJob.booking_id ? "Sending..." : "Finish Work & Request Confirmation"}
                        </button>
                      ))}
                  </div>
                </article>
              ) : (
                <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[#14161E]/20 p-8 text-center">
                  <Clock className="mx-auto mb-3 h-10 w-10 text-[#5C6070]" />
                  <h3 className="text-base font-semibold text-white">No active orders right now</h3>
                  <p className="mt-1 text-xs text-[#9CA0AE]">When a coordinator assigns work to you, it will show up here immediately.</p>
                </div>
              )}

              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <div className="h-6 w-1.5 rounded-full bg-amber-400" />
                  Active Jobs
                </h2>

                {activeJobs.length === 0 ? (
                  <div className="rounded-2xl bg-[#14161E]/20 p-6 text-center text-sm text-[#9CA0AE]">No active bookings right now.</div>
                ) : (
                  <div className="space-y-3">
                    {activeJobs.map((job) => (
                      <div
                        key={job.booking_id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#14161E]/40 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{job.customer_name}</h4>
                            <span className="rounded-full bg-[#C8A55E]/10 px-2 py-0.5 text-xs text-[#C8A55E]">{job.booking_type}</span>
                          </div>
                          <p className="mt-1 text-xs text-[#9CA0AE]">{job.service_category}</p>
                          <p className="mt-1 text-xs text-[#9CA0AE]">{job.address}</p>
                          <p className="mt-0.5 text-xs text-[#5C6070]">Time: {job.preferred_time}</p>
                        </div>

                        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${job.status === "In Progress" ? "bg-amber-500/10 text-amber-400" : job.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-300"}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>

            
          </div>
        )}

        
      </div>
    </main>
  );
}
