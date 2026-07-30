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
import { mapTechnicians } from "@/lib/emergencyData";

// ── Default filter state ──────────────────────────────────────────────────────

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  status: "All",
  serviceCategory: "All",
  priority: "All",
};

interface BackendEmergencyRequest {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  address: string;
  city?: string;
  serviceCategory: string;
  description: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapRowToRequest(row: BackendEmergencyRequest): EmergencyRequest {
  const normalizeServiceCategory = (v: string) => {
    const s = v.toLowerCase();
    if (s.includes("plumb")) return "Plumbing" as const;
    if (s.includes("elect")) return "Electrical" as const;
    if (s.includes("ac")) return "AC Repair" as const;
    if (s.includes("appl")) return "Appliance Repair" as const;
    if (s.includes("carp")) return "Carpenter" as const;
    if (s.includes("clean")) return "Cleaning" as const;
    return "Other" as const;
  };

  const normalizeStatus = (v: string) => {
    const s = v.toLowerCase();
    if (s.includes("assign")) return "Assigned" as const;
    if (s.includes("progress")) return "In Progress" as const;
    if (s.includes("resolv")) return "Resolved" as const;
    return "Pending" as const;
  };

  const normalizePriority = (v: string) => {
    const s = v.toLowerCase();
    if (s.includes("crit")) return "Critical" as const;
    if (s.includes("high")) return "High" as const;
    if (s.includes("med")) return "Medium" as const;
    return "Low" as const;
  };

  return {
    id: row.id,
    customerName: row.customerName,
    phoneNumber: row.customerPhone || "",
    address: row.address,
    serviceCategory: normalizeServiceCategory(row.serviceCategory),
    priority: normalizePriority(row.priority || "High"),
    status: normalizeStatus(row.status || "pending"),
    submittedAt: row.createdAt || new Date().toISOString(),
    problemDescription: row.description,
    assignedTechnicianId: null,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DispatcherEmergencyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch pending requests from the backend ─────────────────────────────
  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/emergency-requests`);

      if (!response.ok) {
        throw new Error("Unable to load emergency requests right now.");
      }

      const payload = await response.json();
      const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
      setRequests(items.map(mapRowToRequest));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load emergency requests right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch approved technicians (existing pattern) ─────────────────────────
  useEffect(() => {
    let active = true;

    const loadTechnicians = async () => {
      try {
        const response = await fetch("/api/approved-technicians", {
          headers: { Accept: "application/json" },
        });
        if (!active) return;
        if (response.ok) {
          const json = await response.json();
          setTechnicians(mapTechnicians(json));
        }
      } catch {
        // Technician list is non-critical; silently ignore
      }
    };

    void loadTechnicians();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    const runLoad = async () => {
      await loadRequests();
      if (!active) return;
    };

    void runLoad();
    const intervalId = window.setInterval(() => {
      void loadRequests();
    }, 5000);

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
  const handleAssign = async (requestId: string, technicianId: string) => {
    alert("Assignment is currently stored in the UI state only. The backend endpoint is ready for persistence next.");
    await loadRequests();
  };

  // ── Reject: update status → 'rejected' ───────────────────────────────────
  const handleReject = async (requestId: string) => {
    alert("Rejection is currently stored in the UI state only. The backend endpoint is ready for persistence next.");
    await loadRequests();
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
