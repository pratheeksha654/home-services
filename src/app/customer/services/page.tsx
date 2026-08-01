"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceRecord {
    booking_id?: string;
    id?: string;
    customer_name?: string;
    email?: string;
    phone?: string;
    service_category?: string;
    problem_description?: string;
    address?: string;
    preferred_date?: string;
    preferred_time?: string;
    status?: string;
    booking_type?: string;
    createdAt?: string;
    // Emergency specific fields
    is_emergency?: boolean;
    emergency_id?: string;
}

export default function CustomerServicesPage() {
    const [services, setServices] = useState<ServiceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    const fetchAllServices = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("accessToken") ||
                localStorage.getItem("homefixpro_token");

            if (!token) {
                setErrorMessage("Authentication token missing. Please sign in.");
                setIsLoading(false);
                return;
            }

            // Fetch normal bookings and emergency requests in parallel
            const [bookingsRes, emergencyRes] = await Promise.all([
                fetch(`${API_BASE_URL}/bookings`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`${API_BASE_URL}/emergency-requests`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }).catch(() => null), // Gracefully fallback if emergency endpoint fails
            ]);

            const bookingsData = await bookingsRes.json();
            let emergencyData = null;

            if (emergencyRes && emergencyRes.ok) {
                emergencyData = await emergencyRes.json();
            }

            if (!bookingsRes.ok) {
                throw new Error(
                    bookingsData.message || "Failed to fetch service history"
                );
            }

            const rawBookings =
                bookingsData?.data?.bookings ||
                bookingsData?.bookings ||
                bookingsData?.data ||
                [];

            const rawEmergency =
                emergencyData?.data?.emergencyRequests ||
                emergencyData?.data?.emergency_requests ||
                emergencyData?.emergency_requests ||
                emergencyData?.items ||
                emergencyData?.data ||
                [];

            const combinedList: ServiceRecord[] = [];

            // Normalize standard bookings
            if (Array.isArray(rawBookings)) {
                rawBookings.forEach((item: any) => {
                    combinedList.push({
                        ...item,
                        booking_id: item.booking_id || item.id,
                        is_emergency: false,
                    });
                });
            }

            // Normalize emergency requests
            if (Array.isArray(rawEmergency)) {
                rawEmergency.forEach((item: any) => {
                    combinedList.push({
                        ...item,
                        booking_id: item.emergency_id || item.id,
                        service_category: item.service_category || item.serviceCategory || item.category || "Emergency Service",
                        problem_description: item.problem_description || item.description,
                        preferred_date: item.preferred_date || item.date || item.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
                        preferred_time: item.preferred_time || item.time || "Immediate / ASAP",
                        status: item.status || "pending",
                        is_emergency: true,
                    });
                });
            }

            // Deduplicate by ID
            const uniqueMap = new Map();
            combinedList.forEach((item) => {
                const key = item.booking_id;
                if (key && !uniqueMap.has(key)) {
                    uniqueMap.set(key, item);
                }
            });

            const list = Array.from(uniqueMap.values());

            // Emergency work is always prioritized; each group is then chronological.
            list.sort((a, b) => {
                if (a.is_emergency !== b.is_emergency) {
                    return a.is_emergency ? -1 : 1;
                }
                const startTimeA = extractStartTime(a.preferred_time);
                const startTimeB = extractStartTime(b.preferred_time);
                const dateA = new Date(`${a.preferred_date || ""} ${startTimeA}`).getTime();
                const dateB = new Date(`${b.preferred_date || ""} ${startTimeB}`).getTime();
                if (isNaN(dateA) || isNaN(dateB)) return 0;
                return dateA - dateB;
            });

            setServices(list);
        } catch (err: any) {
            console.error("Fetch Services Error:", err.message);
            setErrorMessage(err.message || "Could not retrieve service records.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllServices();
    }, [API_BASE_URL]);

    const extractStartTime = (timeStr?: string) => {
        if (!timeStr || timeStr.includes("Immediate")) return "00:00";
        const cleanStr = timeStr.split("-")[0].trim();
        return cleanStr;
    };

    const isWithin40MinutesBeforeStart = (dateStr?: string, timeStr?: string) => {
        if (!dateStr || !timeStr || timeStr.includes("Immediate")) return false;
        try {
            const startTimeOnly = extractStartTime(timeStr);
            const targetDateTime = new Date(`${dateStr} ${startTimeOnly}`);

            if (isNaN(targetDateTime.getTime())) return false;

            const now = new Date();
            const diffMs = targetDateTime.getTime() - now.getTime();
            const diffMinutes = diffMs / (1000 * 60);

            return diffMinutes <= 40;
        } catch {
            return false;
        }
    };

    const handleCancelService = async (item: ServiceRecord) => {
        const bId = item.booking_id;
        if (!bId) return;

        if (!item.is_emergency && isWithin40MinutesBeforeStart(item.preferred_date, item.preferred_time)) {
            setErrorMessage("Cancellation is not possible 40 minutes before the time slot booked.");
            return;
        }

        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            setCancellingId(bId);
            setErrorMessage("");
            setSuccessMessage("");

            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("accessToken") ||
                localStorage.getItem("homefixpro_token");

            const endpoint = item.is_emergency
                ? `${API_BASE_URL}/emergency-requests/${bId}/cancel`
                : `${API_BASE_URL}/bookings/${bId}/cancel`;

            const res = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || "Failed to cancel service request");
            }

            setSuccessMessage("Service request cancelled successfully.");
            fetchAllServices();
        } catch (err: any) {
            console.error("Cancel Service Error:", err.message);
            setErrorMessage(err.message || "Could not cancel service request.");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status?: string) => {
        const s = status?.toLowerCase() || "pending";
        switch (s) {
            case "assigned":
                return (
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Assigned
                    </span>
                );
            case "in_progress":
            case "inprogress":
                return (
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        In Progress
                    </span>
                );
            case "completed":
                return (
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Completed
                    </span>
                );
            case "cancelled":
                return (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Pending
                    </span>
                );
        }
    };

    const filteredServices = services.filter((item) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "emergency") return item.is_emergency === true;
        const currentStatus = (item.status || "pending").toLowerCase();
        if (filterStatus === "in_progress") {
            return currentStatus === "in_progress" || currentStatus === "inprogress";
        }
        return currentStatus === filterStatus;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#08090D] text-white flex items-center justify-center font-inter">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-[#9CA0AE]">
                        Loading your service timeline...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-outfit tracking-tight">
                            My Services Timeline
                        </h1>
                        <p className="text-xs text-[#9CA0AE] mt-1">
                            Track standard bookings and emergency requests in chronological order.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/customer/emergency-booking"
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-500 hover:text-white transition-all w-fit"
                        >
                            🚨 Emergency Booking
                        </Link>
                        <Link
                            href="/customer/book"
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#C8A55E] text-[#08090D] font-bold text-xs rounded-xl shadow-lg shadow-[#C8A55E]/10 hover:bg-[#b08e48] transition-all w-fit"
                        >
                            + Book New Service
                        </Link>
                    </div>
                </div>

                {errorMessage && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                        <span>✅</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-4">
                    {[
                        { label: "All", value: "all" },
                        { label: "Emergency", value: "emergency" },
                        { label: "Pending", value: "pending" },
                        { label: "Assigned", value: "assigned" },
                        { label: "In Progress", value: "in_progress" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === tab.value
                                ? "bg-[#C8A55E] text-[#08090D] shadow-md shadow-[#C8A55E]/20"
                                : "bg-[#10121A] text-[#9CA0AE] border border-[rgba(255,255,255,0.06)] hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {filteredServices.length === 0 ? (
                    <div className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-12 text-center space-y-4">
                        <div className="text-4xl">🛠️</div>
                        <h3 className="text-base font-bold text-white font-outfit">
                            No Service Records Found
                        </h3>
                        <p className="text-xs text-[#9CA0AE] max-w-sm mx-auto">
                            You don't have any service records or emergency requests matching this status filter.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                            <Link
                                href="/customer/book"
                                className="px-4 py-2 bg-[#14161E] border border-[#C8A55E]/40 text-[#C8A55E] rounded-xl text-xs font-semibold hover:bg-[#C8A55E]/10 transition-colors"
                            >
                                Book a Service
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(filteredServices || []).map((item, index) => {
                            const bId = item.booking_id || `srv-${index}`;
                            const title = item.service_category || "Home Service";
                            const date = item.preferred_date || "N/A";
                            const time = item.preferred_time || "N/A";
                            const currentStatus = (item.status || "pending").toLowerCase();

                            const isEligibleToCancel =
                                (currentStatus === "pending" || currentStatus === "assigned") &&
                                (item.is_emergency || !isWithin40MinutesBeforeStart(item.preferred_date, item.preferred_time));

                            const tooLate = !item.is_emergency && isWithin40MinutesBeforeStart(item.preferred_date, item.preferred_time) &&
                                (currentStatus === "pending" || currentStatus === "assigned");

                            const isActive = currentStatus === "pending" || currentStatus === "assigned" || currentStatus === "in_progress" || currentStatus === "inprogress";

                            return (
                                <div
                                    key={bId}
                                    className={`bg-[#10121A] border rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between space-y-5 transition-all ${item.is_emergency ? "border-rose-500/40 shadow-lg shadow-rose-500/5" : "border-[rgba(255,255,255,0.06)] hover:border-[#C8A55E]/30"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-white font-outfit">
                                                    {title}
                                                </h2>
                                                {item.is_emergency && (
                                                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest animate-pulse">
                                                        Emergency
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#9CA0AE] mt-0.5">
                                                ID: #{bId.slice(-6)}
                                            </p>
                                        </div>
                                        <div>{getStatusBadge(item.status)}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 bg-[#14161E] rounded-xl p-4 border border-[rgba(255,255,255,0.04)] text-xs">
                                        <div>
                                            <span className="text-[10px] text-[#9CA0AE] uppercase block mb-0.5 font-medium">
                                                Scheduled Date
                                            </span>
                                            <span className="text-white font-medium">{date}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#9CA0AE] uppercase block mb-0.5 font-medium">
                                                Time Slot
                                            </span>
                                            <span className="text-white font-medium">{time}</span>
                                        </div>
                                        {item.address && (
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-[#9CA0AE] uppercase block mb-0.5 font-medium">
                                                    Address
                                                </span>
                                                <span className="text-white font-medium line-clamp-1">
                                                    {item.address}
                                                </span>
                                            </div>
                                        )}
                                        {item.problem_description && (
                                            <div className="col-span-2 pt-1 border-t border-[rgba(255,255,255,0.04)]">
                                                <span className="text-[10px] text-[#9CA0AE] uppercase block mb-0.5 font-medium">
                                                    Issue Description
                                                </span>
                                                <span className="text-[#9CA0AE] italic line-clamp-2">
                                                    {item.problem_description}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2 text-xs">
                                        {isActive ? (
                                            <Link
                                                href={`/customer/track-booking/${bId}`}
                                                className="px-3.5 py-2 bg-[#C8A55E]/10 border border-[#C8A55E]/30 text-[#C8A55E] hover:bg-[#C8A55E] hover:text-[#08090D] transition-all rounded-xl font-bold flex-1 text-center"
                                            >
                                                Track Service ➔
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] text-[#9CA0AE] italic flex-1">
                                                {currentStatus === "cancelled" ? "Service was cancelled" : "Service finished"}
                                            </span>
                                        )}

                                        {isEligibleToCancel && (
                                            <button
                                                onClick={() => handleCancelService(item)}
                                                disabled={cancellingId === bId}
                                                className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-xl font-bold disabled:opacity-50"
                                            >
                                                {cancellingId === bId ? "Cancelling..." : "Cancel"}
                                            </button>
                                        )}

                                        {tooLate && (
                                            <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-2 rounded-xl text-center font-medium">
                                                Too late to cancel (&lt;40 mins before start)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
