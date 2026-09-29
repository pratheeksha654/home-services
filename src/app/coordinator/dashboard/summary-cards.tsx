"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import StatsCard from "./stats-card";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  BriefcaseBusiness,
  ClipboardList,
  Heart,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface SummaryData {
  totalBookings: number;
  pendingRequests: number;
  emergency: number;
  activeServices: number;
  completed: number;
  elderlyPending: number;
  emergencyBookings: number;
  todaysServices: number;
}

const defaultSummary: SummaryData = {
  totalBookings: 0,
  pendingRequests: 0,
  emergency: 0,
  activeServices: 0,
  completed: 0,
  elderlyPending: 0,
  emergencyBookings: 0,
  todaysServices: 0,
};

export default function SummaryCards() {
  const [summary, setSummary] = useState<SummaryData>(defaultSummary);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const fetchSummary = useCallback(async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!backendUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
      }

      const token = getTokenRef.current?.();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${backendUrl}/coordinator/dashboard-summary`;

      const res = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server.");
      }

      if (data && typeof data === "object" && "success" in data && "data" in data) {
        const payload = data as { success: boolean; data: { summary?: Partial<SummaryData> } };
        if (payload.success && payload.data?.summary) {
          setSummary((prev) => ({ ...prev, ...payload.data.summary }));
          return;
        }
      }

      throw new Error("Unexpected response format.");
    } catch (error) {
      console.error("Failed to load dashboard summary:", error);
      setSummary(defaultSummary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;
      await fetchSummary();
    };

    load();

    // Only run interval/side-effects in the browser
    if (typeof window !== "undefined") {
      const intervalId = window.setInterval(() => {
        if (mounted) fetchSummary();
      }, 30000);

      const handleFocus = () => {
        if (mounted) fetchSummary();
      };

      window.addEventListener("focus", handleFocus);

      return () => {
        mounted = false;
        window.clearInterval(intervalId);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [fetchSummary]);

  const cards = [
    {
      title: "Total Bookings",
      value: summary.totalBookings,
      icon: ClipboardList,
      color: "text-[#C8A55E]",
    },
    {
      title: "Pending Requests",
      value: summary.pendingRequests,
      icon: Clock3,
      color: "text-orange-400",
    },
    {
      title: "Elderly Pending",
      value: summary.elderlyPending,
      icon: Heart,
      color: "text-rose-400",
    },
    {
      title: "Emergency",
      value: summary.emergency,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "Active Services",
      value: summary.activeServices,
      icon: BriefcaseBusiness,
      color: "text-indigo-400",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      color: "text-green-400",
    },
  ];

  return (
    <section className="mt-10">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-6 text-2xl font-bold text-[#ECEDF0]"
      >
        Dashboard Overview
      </motion.h2>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={loading ? "—" : card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
    </section>
  );
}
