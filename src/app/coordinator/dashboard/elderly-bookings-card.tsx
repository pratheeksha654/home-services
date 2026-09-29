"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  UserCheck,
  MapPin,
  Calendar,
  Phone,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle2,
} from "lucide-react";

interface ElderlyBooking {
  booking_id: string;
  customer_name: string;
  phone: string;
  email: string;
  service_category: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
}

interface Technician {
  technician_id: string;
  name: string;
  skills: string;
  experience: number;
  rating: number;
  availability: string;
  approval_status: string;
  current_jobs: number;
  profile_image: string | null;
}

export default function ElderlyBookingsCard() {
  const [bookings, setBookings] = useState<ElderlyBooking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<ElderlyBooking | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const fetchElderlyBookings = async () => {
    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("homefixpro_token") || localStorage.getItem("token")
        : null;

      const response = await fetch(`${API_URL}/coordinator/elderly-bookings`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching elderly bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch(`${API_URL}/technicians?approval_status=Approved&availability=Available`);
      const data = await response.json();
      if (data.success && data.data?.technicians) {
        setTechnicians(data.data.technicians);
      } else {
        setTechnicians([]);
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setTechnicians([]);
    }
  };

  useEffect(() => {
    fetchElderlyBookings();
    fetchTechnicians();

    const intervalId = setInterval(() => {
      fetchElderlyBookings();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !selectedTechnicianId) return;

    setIsAssigning(true);
    setErrorMessage(null);

    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("homefixpro_token") || localStorage.getItem("token")
        : null;

      const response = await fetch(`${API_URL}/coordinator/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          technician_id: selectedTechnicianId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to assign technician.");
      }

      setSuccessMessage(`Technician assigned successfully to ${selectedBooking.customer_name}'s elderly care booking.`);
      setSelectedBooking(null);
      setSelectedTechnicianId(null);
      fetchElderlyBookings();

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to assign technician.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#ECEDF0] flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            Elderly Care Bookings
          </h2>
          <p className="mt-1 text-sm text-[#9CA0AE]">
            Phone-assisted bookings requiring special care attention
          </p>
        </div>
        <button
          onClick={fetchElderlyBookings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14161E] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-white hover:border-[#C8A55E]/50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C8A55E]" : ""}`} />
          Refresh
        </button>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]/40 p-10 text-center text-sm text-[#9CA0AE]">
          Loading elderly bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[#14161E]/20 p-12 text-center">
          <Heart className="w-12 h-12 text-[#5C6070] mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white">No Pending Elderly Bookings</h3>
          <p className="mt-1 text-xs text-[#9CA0AE]">
            Elderly care bookings will appear here when created via phone assistance.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => {
            return (
              <motion.div
                key={booking.booking_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl border border-rose-500/20 bg-[#10121A] p-6 shadow-lg shadow-rose-500/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          ELDERLY CARE
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {booking.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-outfit text-white">
                        {booking.customer_name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs mb-4">
                    <div className="flex items-center gap-2 text-[#9CA0AE]">
                      <Phone className="w-3.5 h-3.5 text-[#C8A55E] shrink-0" />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9CA0AE]">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A55E] shrink-0" />
                      <span className="line-clamp-1">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9CA0AE]">
                      <Calendar className="w-3.5 h-3.5 text-[#C8A55E] shrink-0" />
                      <span>
                        {booking.preferred_date} • {booking.preferred_time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Assign Technician
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#10121A] border border-[#C8A55E]/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setSelectedBooking(null);
                setSelectedTechnicianId(null);
              }}
              className="absolute top-4 right-4 text-[#9CA0AE] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold">
                Assign Technician for Elderly Care
              </span>
              <h3 className="text-xl font-bold font-outfit text-white mt-1">
                {selectedBooking.customer_name}
              </h3>
              <p className="text-xs text-[#9CA0AE] mt-1">
                {selectedBooking.service_category} • {selectedBooking.preferred_date} ({selectedBooking.preferred_time})
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold uppercase text-[#9CA0AE]">
                Select Available Technician
              </label>

              {technicians.length === 0 ? (
                <p className="text-xs text-rose-400 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  No approved technicians are available right now.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {technicians.map((tech) => {
                    const isSelected = selectedTechnicianId === tech.technician_id;
                    return (
                      <div
                        key={tech.technician_id}
                        onClick={() => setSelectedTechnicianId(tech.technician_id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#C8A55E]/15 border-[#C8A55E] shadow-md shadow-[#C8A55E]/10"
                            : "bg-[#14161E] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                            <p className="text-[11px] text-[#9CA0AE]">{tech.skills}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                            {tech.availability}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                              isSelected
                                ? "bg-[#C8A55E] text-[#08090D] border-[#C8A55E]"
                                : "border-[rgba(255,255,255,0.2)]"
                            }`}
                          >
                            {isSelected && "✓"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setSelectedTechnicianId(null);
                }}
                className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs text-[#9CA0AE] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedTechnicianId || isAssigning}
                onClick={handleAssignTechnician}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center gap-2"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
