"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import EmergencyHeader from "@/components/coordinator/emergencyRequests/EmergencyHeader";
import SearchFilterBar from "@/components/coordinator/emergencyRequests/SearchFilterBar";
import EmergencyRequestList from "@/components/coordinator/emergencyRequests/EmergencyRequestList";
import type {
  EmergencyRequest,
  FilterState,
  Technician,
} from "@/app/types/coordinator";
import { mapEmergencyRequests, mapTechnicians } from "@/lib/emergencyData";

// ── Default filter state ──────────────────────────────────────────────────────

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  status: "All",
  serviceCategory: "All",
  priority: "All",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DispatcherEmergencyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch pending requests from the backend ─────────────────────────────
  const loadRequests = useCallback(async (showBlockingLoader = false) => {
    if (showBlockingLoader) {
      setLoading(true);
    }
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const token = typeof window !== "undefined"
        ? localStorage.getItem("homefixpro_token") || localStorage.getItem("token")
        : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      };

      // Append a timestamp to prevent 304 caching issues
      const timestamp = new Date().getTime();

      const [requestsResponse, techniciansResponse] = await Promise.all([
        fetch(`${API_URL}/emergency-requests?_t=${timestamp}`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/technicians?approval_status=Approved&availability=Available&_t=${timestamp}`, { headers, cache: "no-store" }),
      ]);

      if (!requestsResponse.ok) {
        throw new Error("Unable to load emergency requests right now.");
      }

      const requestsPayload = await requestsResponse.json();
      const techniciansPayload = techniciansResponse.ok ? await techniciansResponse.json() : null;

      // Keep the response envelope intact: the mapper reads the canonical
      // `data.emergencyRequests` field returned by the backend.
      setRequests(mapEmergencyRequests(requestsPayload));

      const rawTechs = techniciansPayload?.data?.technicians ?? techniciansPayload?.data ?? techniciansPayload;
      const techArray = Array.isArray(rawTechs) ? rawTechs : (rawTechs ? [rawTechs] : []);
      setTechnicians(mapTechnicians(techArray));

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load emergency requests right now.");
    } finally {
      if (showBlockingLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const runLoad = async () => {
      await loadRequests(true);
      if (!active) return;
    };

    void runLoad();
    const intervalId = window.setInterval(() => {
      void loadRequests(false);
    }, 10000); // Increased interval to 10 seconds to stop spamming

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [loadRequests]);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // ── Accept: update status → 'assigned' ───────────────────────────────────
  const handleAssign = async (
    requestId: string,
    technicianId: string
  ) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api/v1";

      const token = typeof window !== "undefined"
        ? localStorage.getItem("homefixpro_token") || localStorage.getItem("token")
        : null;

      const res = await fetch(
        `${API_URL}/emergency-requests/${requestId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            technicianId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to assign technician.");
        return;
      }

      await loadRequests(false);
    } catch (err) {
      console.error(err);
      alert("Unable to assign technician.");
    }
  };

  // ── Reject: update status → 'rejected' ───────────────────────────────────
  const handleReject = async () => {
    alert("Rejection is currently stored in the UI state only. The backend endpoint is ready for persistence next.");
    await loadRequests(false);
  };

  // ── Filtered Requests ─────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    const query = filters.searchQuery.toLowerCase().trim();

    return requests.filter((req) => {
      // Search filter
      if (
        query &&
        !req.customerName.toLowerCase().includes(query) &&
        !req.phoneNumber.toLowerCase().includes(query) &&
        !req.address.toLowerCase().includes(query)
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "All" && req.status !== filters.status) {
        return false;
      }

      // Category filter
      if (
        filters.serviceCategory !== "All" &&
        req.serviceCategory !== filters.serviceCategory
      ) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "All" && req.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [requests, filters]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090D] text-[#ECEDF0]">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#C8A55E]/8 blur-[200px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#6366F1]/8 blur-[180px]" />

      {/* ── Hero Section ── */}
      <EmergencyHeader />

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {/* Search + Filter bar */}
        <SearchFilterBar
          filters={filters}
          onChange={handleFilterChange}
          totalCount={requests.length}
          filteredCount={filteredRequests.length}
        />

        {loading ? (
          <div className="mt-8 rounded-3xl border border-[#C8A55E]/10 bg-[#151922] p-10 text-center text-sm text-[#9CA0AE]">
            Loading emergency requests…
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center text-sm text-red-300">
            {error}
          </div>
        ) : (
          <EmergencyRequestList
            requests={filteredRequests}
            technicians={technicians}
            onAssign={handleAssign}
            onReject={handleReject}
          />
        )}
      </div>

      <Footer />
    </main>
  );
}
