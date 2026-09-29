"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import {
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  User,
  Star,
  Briefcase,
  Wrench,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

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
  assigned_technician: string | null;
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

export default function CoordinatorAssignTechnicianPage() {
  return (
    <AuthGuard>
      <AssignTechnicianContent />
    </AuthGuard>
  );
}

function AssignTechnicianContent() {
  const isMatchingTechnician = (
    technicianSkill: string,
    serviceCategory: string,
  ) => {
    if (!technicianSkill || !serviceCategory) return false;
    const skill = technicianSkill.toLowerCase();
    const category = serviceCategory.toLowerCase();

    if (category.includes("paint") && skill.includes("paint")) return true;
    if (category.includes("carpent") && skill.includes("carpent")) return true;
    if (
      (category.includes("clean") || category.includes("housekeeping")) &&
      (skill.includes("clean") ||
        skill.includes("housekeeping") ||
        skill.includes("maid"))
    )
      return true;
    if (category.includes("plumb") && skill.includes("plumb")) return true;
    if (
      (category.includes("electric") || category.includes("wiring")) &&
      (skill.includes("electric") || skill.includes("wiring"))
    )
      return true;
    if (
      (category.includes("ac") ||
        category.includes("cool") ||
        category.includes("air")) &&
      (skill.includes("ac") ||
        skill.includes("cool") ||
        skill.includes("air") ||
        skill.includes("hvac"))
    )
      return true;
    if (
      (category.includes("appliance") ||
        category.includes("fridge") ||
        category.includes("washing") ||
        category.includes("repair")) &&
      (skill.includes("appliance") ||
        skill.includes("fridge") ||
        skill.includes("washing") ||
        skill.includes("repair"))
    )
      return true;
    if (category.includes("pest") && skill.includes("pest")) return true;

    return skill.includes(category) || category.includes(skill);
  };

  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [availableTechnicians, setAvailableTechnicians] = useState<
    Technician[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignError, setAssignError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
 

  // Assignment Modal / Selection state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<
    string | null
  >(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // States for fetching technicians dynamically matching the category of the selected booking
  const [modalTechnicians, setModalTechnicians] = useState<Technician[]>([]);
  const [loadingModalTechs, setLoadingModalTechs] = useState<boolean>(false);
  const [isFallbackList, setIsFallbackList] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedBooking) {
      setModalTechnicians([]);
      setIsFallbackList(false);
      return;
    }

    const fetchModalTechs = async () => {
      setLoadingModalTechs(true);
      setIsFallbackList(false);
      try {
        const category = selectedBooking.service_category;
        const res = await fetch(
          `${backendUrl}/technicians/available-for-booking?date=${selectedBooking.preferred_date}&time=${selectedBooking.preferred_time}`,
        );
        const data = await parseJsonResponse(res);

        if (
          res.ok &&
          data?.data?.technicians &&
          data.data.technicians.length > 0
        ) {
          const uniqueTechsMap = new Map();
          data.data.technicians.forEach((t: Technician) => {
            if (t.technician_id) {
              uniqueTechsMap.set(t.technician_id, t);
            }
          });
          setModalTechnicians(Array.from(uniqueTechsMap.values()));
        } else {
          setIsFallbackList(true);
          const allRes = await fetch(
            `${backendUrl}/technicians?approval_status=Approved&availability=Available`,
          );
          const allData = await parseJsonResponse(allRes);
          if (allRes.ok && allData?.data?.technicians) {
            const uniqueTechsMap = new Map();
            allData.data.technicians.forEach((t: Technician) => {
              if (t.technician_id) {
                uniqueTechsMap.set(t.technician_id, t);
              }
            });
            setModalTechnicians(Array.from(uniqueTechsMap.values()));
          } else {
            setModalTechnicians([]);
          }
        }
      } catch (err) {
        console.error("Error fetching modal technicians:", err);
        setModalTechnicians([]);
      } finally {
        setLoadingModalTechs(false);
      }
    };

    fetchModalTechs();
  }, [selectedBooking]);

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const parseJsonResponse = async (response: Response) => {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `The server returned an unexpected response for ${response.url}.`,
      );
    }
  };

  // Fetch pending normal requests and available technicians
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch pending normal bookings
      const bookingsRes = await fetch(
        `${backendUrl}/coordinator/pending-requests`,
      );
      const bookingsData = await parseJsonResponse(bookingsRes);

      if (bookingsRes.ok && bookingsData?.data?.requests) {
        setPendingBookings(bookingsData.data.requests);
      } else {
        setPendingBookings([]);
      }

      // 2. Fetch approved and available technicians
      const techsRes = await fetch(
        `${backendUrl}/technicians?approval_status=Approved&availability=Available`,
      );
      const techsData = await parseJsonResponse(techsRes);

      if (techsRes.ok && techsData?.data?.technicians) {
        const uniqueTechsMap = new Map();
        techsData.data.technicians.forEach((t: Technician) => {
          if (t.technician_id) {
            uniqueTechsMap.set(t.technician_id, t);
          }
        });
        setAvailableTechnicians(Array.from(uniqueTechsMap.values()));
      } else {
        setAvailableTechnicians([]);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(
        err.message ||
          "Failed to fetch pending bookings or available technicians. Please check your backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Technician Assignment submission
  const handleConfirmAssignment = async () => {
    if (!selectedBooking || !selectedTechnicianId) return;

    setIsAssigning(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/coordinator/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          technician_id: selectedTechnicianId,
        }),
      });

    
      const data = await parseJsonResponse(response);
   
      if (!response.ok) {
  setAssignError(
    `

${
  modalTechnicians.find(
    (t) => t.technician_id === selectedTechnicianId
  )?.name || "This technician"
} is already assigned to another customer on
${selectedBooking?.preferred_date} during
${selectedBooking?.preferred_time}.

Please choose another technician.`
  );


  return;
}

      // Success: Remove assigned booking from pending list
      setPendingBookings((prev) =>
        prev.filter((b) => b.booking_id !== selectedBooking.booking_id),
      );

      // Update local technician availability list
      setAvailableTechnicians((prev) =>
        prev.filter((t) => t.technician_id !== selectedTechnicianId),
      );

      const assignedTech = availableTechnicians.find(
        (t) => t.technician_id === selectedTechnicianId,
      );
      setSuccessMessage(
        `Successfully assigned technician "${assignedTech?.name || selectedTechnicianId}" to Booking #${selectedBooking.booking_id.slice(0, 8)}!`,
      );

      setAssignError("");

      // Close modal
      setSelectedBooking(null);
      setSelectedTechnicianId(null);

      // Clear success notification after 4 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error("Assignment error:", err);
      setError(err.message || "Failed to complete technician assignment.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8A55E]/10 text-[#C8A55E] border border-[#C8A55E]/20">
                Coordinator Panel
              </span>
            </div>
            <h1 className="text-3xl font-bold font-outfit text-white tracking-tight">
              Assign Technician to Pending Bookings
            </h1>
            <p className="text-sm text-[#9CA0AE] mt-1">
              Manage normal service requests, view available technicians, and
              dispatch jobs.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14161E] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-white hover:border-[#C8A55E]/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C8A55E]" : ""}`}
            />
            <span>Refresh Pending List</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#9CA0AE]">
              Fetching pending normal bookings and technicians...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Pending Bookings List (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold font-outfit text-white flex items-center gap-2">
                  <span>Pending Normal Requests</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#C8A55E]/20 text-[#C8A55E]">
                    {pendingBookings.length}
                  </span>
                </h2>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white">
                    No Pending Bookings
                  </h3>
                  <p className="text-xs text-[#9CA0AE] mt-1">
                    All normal service requests have been assigned to
                    technicians.
                  </p>
                </div>
              ) : (
                (pendingBookings || []).map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="bg-[#10121A] border border-[rgba(255,255,255,0.08)] hover:border-[#C8A55E]/40 rounded-2xl p-6 transition-all duration-200 backdrop-blur-xl shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C8A55E]/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono text-[#C8A55E] font-semibold bg-[#C8A55E]/10 px-2 py-0.5 rounded border border-[#C8A55E]/20">
                            ID: {booking.booking_id.slice(0, 8)}...
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-outfit text-white">
                          {booking.customer_name}
                        </h3>
                      </div>

                      <button
                        onClick={() => {
                          setAssignError("");
                          setSelectedBooking(booking);
                          setSelectedTechnicianId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Assign Technician</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[#5C6070] font-semibold uppercase block mb-1">
                          Service Category
                        </span>
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Wrench className="w-3.5 h-3.5 text-[#C8A55E]" />
                          <span>{booking.service_category}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[#5C6070] font-semibold uppercase block mb-1">
                          Preferred Date & Time
                        </span>
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#C8A55E]" />
                          <span>
                            {booking.preferred_date} • {booking.preferred_time}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[#5C6070] font-semibold uppercase block mb-1">
                          Contact Info
                        </span>
                        <div className="space-y-1 text-white">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#9CA0AE]" />
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#9CA0AE]" />
                            <span className="truncate max-w-[200px]">
                              {booking.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[#5C6070] font-semibold uppercase block mb-1">
                          Service Address
                        </span>
                        <div className="flex items-start gap-1.5 text-white font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C8A55E] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {booking.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                      <span className="text-[#5C6070] font-semibold uppercase block mb-1 text-[10px]">
                        Problem Description
                      </span>
                      <p className="text-xs text-[#ECEDF0] bg-[#14161E] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                        {booking.problem_description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Available Technicians Overview (1 Col) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold font-outfit text-white flex items-center gap-2">
                  <span>Available Technicians</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                    {availableTechnicians.length}
                  </span>
                </h2>
              </div>

              {availableTechnicians.length === 0 ? (
                <div className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 text-center text-xs text-[#9CA0AE]">
                  No technicians are currently marked as "Available" and
                  "Approved".
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {(availableTechnicians || []).map((tech) => (
                    <div
                      key={tech.technician_id}
                      className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex items-start gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {tech.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-[#C8A55E]"></div>
                        </div>
                        <p className="text-[11px] text-[#9CA0AE] truncate">
                          {tech.skills}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#5C6070]">
                          <span>{tech.experience} yrs exp</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            {tech.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technician Assignment Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#10121A] border border-[#C8A55E]/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-[#9CA0AE] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs text-[#C8A55E] uppercase tracking-wider font-semibold">
                  Step 2 of 2: Dispatch Technician
                </span>
                <h3 className="text-xl font-bold font-outfit text-white mt-1">
                  Assign Technician for {selectedBooking.customer_name}
                </h3>
                <p className="text-xs text-[#9CA0AE] mt-1">
                  Category:{" "}
                  <strong className="text-white">
                    {selectedBooking.service_category}
                  </strong>{" "}
                  • Preferred Time:{" "}
                  <strong className="text-[#C8A55E]">
                    {selectedBooking.preferred_date} (
                    {selectedBooking.preferred_time})
                  </strong>
                </p>
              </div>

              <div className="space-y-3 mb-6">
               
                <label className="block text-xs font-semibold uppercase text-[#9CA0AE]">
                  Select Available & Approved Technician
                </label>

                {assignError && (
  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
    <h3 className="text-red-400 font-bold">
      ❌ Technician Not Available
    </h3>

    <p className="mt-2 whitespace-pre-line text-red-200">
      {assignError}
    </p>
  </div>
)}

                {loadingModalTechs ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-xs text-[#C8A55E]">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Fetching suitable technicians...
                  </div>
                ) : modalTechnicians.length === 0 ? (
                  <p className="text-xs text-rose-400 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                    No approved technicians are available right now. Please try
                    again later or approve applications.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {isFallbackList && (
                      <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                        ⚠️ No exact skill match for "
                        {selectedBooking.service_category}". Showing all
                        available technicians:
                      </p>
                    )}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {(modalTechnicians || []).map((tech) => {
                        const isSelected =
                          selectedTechnicianId === tech.technician_id;
                        return (
                          <div
                            key={tech.technician_id}
                            onClick={() =>
                              setSelectedTechnicianId(tech.technician_id)
                            }
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#C8A55E]/15 border-[#C8A55E] shadow-md shadow-[#C8A55E]/10"
                                : "bg-[#14161E] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="text-xs font-bold text-white">
                                  {tech.name}
                                </h4>
                                <p className="text-[11px] text-[#9CA0AE]">
                                  {tech.skills}
                                </p>
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
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs text-[#9CA0AE] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedTechnicianId || isAssigning}
                  onClick={handleConfirmAssignment}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center gap-2"
                >
                  {isAssigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
