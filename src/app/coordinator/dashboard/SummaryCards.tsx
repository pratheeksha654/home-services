"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  BriefcaseBusiness,
  ClipboardList,
} from "lucide-react";

interface SummaryData {
  totalBookings: number;
  pendingRequests: number;
  emergency: number;
  activeServices: number;
  completed: number;
  todaysServices: number;
}

const defaultSummary: SummaryData = {
  totalBookings: 0,
  pendingRequests: 0,
  emergency: 0,
  activeServices: 0,
  completed: 0,
  todaysServices: 0,
};

export default function SummaryCards() {
  const [summary, setSummary] = useState<SummaryData>(defaultSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${backendUrl}/coordinator/dashboard-summary`);
        const data = await res.json();
        if (data?.data?.summary) {
          setSummary(data.data.summary);
        }
      } catch (error) {
        console.error("Failed to load dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

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