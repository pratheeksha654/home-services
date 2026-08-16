"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Wrench,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Zap,
  Wind,
  ShieldCheck,
  Award,
  UserCheck
} from "lucide-react";

interface StatusDist {
  status: string;
  count: number;
}

interface CategoryDemand {
  category: string;
  count: number;
}

interface TechAvail {
  availability: string;
  count: number;
}

interface DailySchedule {
  date: string;
  count: number;
}

interface StatsData {
  users: {
    total: number;
    customers: number;
    coordinators: number;
    technicians: number;
  };
  bookings: {
    total: number;
    pending: number;
    active: number;
    completed: number;
  };
  emergency: {
    total: number;
    pending: number;
  };
  statusDistribution: StatusDist[];
  categoryDemand: CategoryDemand[];
  technicianAvailability: TechAvail[];
  dailySchedules: DailySchedule[];
}

export default function AdminDashboardPage() {
  const { getToken, user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard statistics.");
      }

      const resData = await res.json();
      if (resData.success) {
        setStats(resData.data.stats);
      } else {
        setError(resData.message || "Failed to load dashboard statistics.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      fetchDashboardData();
    }
  }, [user]);

  // Calculate statistics
  const totalBookings = stats?.bookings.total || 0;
  const completedBookings = stats?.bookings.completed || 0;
  const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  const totalTechs = stats?.users.technicians || 0;
  const busyTechs = stats?.technicianAvailability.find(
    (t) => t.availability.toLowerCase() === "busy"
  )?.count || 0;
  const activeEmergencies = stats?.emergency.pending || 0;

  // Category Icon Mapping
  const getCategoryIcon = (category: string) => {
    const name = category?.toLowerCase() || "";
    if (name.includes("plumb")) return Wrench;
    if (name.includes("electr") || name.includes("wire")) return Zap;
    if (name.includes("ac") || name.includes("conditioner") || name.includes("appliance")) return Wind;
    if (name.includes("clean") || name.includes("maid")) return Sparkles;
    return Activity;
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 rounded-3xl bg-surface border border-border" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 h-96 rounded-3xl bg-surface border border-border" />
          <div className="lg:col-span-2 space-y-8">
            <div className="h-44 rounded-3xl bg-surface border border-border" />
            <div className="h-44 rounded-3xl bg-surface border border-border" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="mx-auto text-red-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-text-primary mb-2">Error Loading Statistics</h2>
        <p className="text-text-secondary text-sm mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-3 bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian rounded-xl font-bold text-sm tracking-wide hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold-glow blur-[140px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-2">
              <Sparkles size={14} />
              <span>Operational Analytics</span>
            </div>
            <h1 className="text-3xl font-black font-heading text-text-primary">
              System <span className="text-gold">Operations</span>
            </h1>
            <p className="mt-1 text-text-secondary text-xs">
              Assess platform activity statistics, monitor technician load levels, and analyze booking dispatch velocity.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Manage Users Card */}
        <Link
          href="/admin/users"
          className="group p-6 rounded-3xl border border-border bg-surface hover:border-gold/30 hover:bg-surface-hover transition-all duration-300 flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gold-glow blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Access Panel</span>
            <h3 className="text-base font-bold text-text-primary">Manage Users</h3>
            <p className="text-xs text-text-secondary">Adjust user roles, permissions, and accounts.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border text-gold group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-300 relative z-10">
            <Users size={20} />
          </div>
        </Link>

        {/* Coordinators Card */}
        <Link
          href="/admin/coordinators"
          className="group p-6 rounded-3xl border border-border bg-surface hover:border-gold/30 hover:bg-surface-hover transition-all duration-300 flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gold-glow blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Staff Directory</span>
            <h3 className="text-base font-bold text-text-primary">Coordinators</h3>
            <p className="text-xs text-text-secondary">Oversee and configure service coordinator staff.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border text-gold group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-300 relative z-10">
            <UserCheck size={20} />
          </div>
        </Link>
      </div>

      {/* Asymmetric Split Layout */}
      <div className="grid gap-8 lg:grid-cols-3 items-stretch">
        
        {/* Left Column: Live KPI Operations Console (1/3 Width) */}
        <div className="lg:col-span-1 rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold-glow blur-[60px] pointer-events-none" />

          {/* Title block */}
          <div className="border-b border-border/50 pb-4 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <ShieldCheck className="text-gold" size={16} />
              <span>Operations Console</span>
            </h2>
          </div>

          {/* Metric Arc (Circular Progress Indicator) */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3 shrink-0">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-surface-raised"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground Arc */}
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-gold transition-all duration-700"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * completionRate) / 100}
                  strokeLinecap="round"
                />
              </svg>
              {/* Central Text */}
              <div className="absolute text-center">
                <span className="text-3xl font-black font-heading text-text-primary">{completionRate}%</span>
                <p className="text-[9px] uppercase font-semibold text-text-muted tracking-wider mt-0.5">Clearance</p>
              </div>
            </div>
          </div>

          {/* Live System Metrics List */}
          <div className="flex-1 space-y-4">
            {/* Platform Jobs */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border/80">
              <div className="flex items-center gap-2.5">
                <ClipboardList size={15} className="text-gold" />
                <span className="text-xs text-text-primary font-medium">Platform Jobs</span>
              </div>
              <span className="text-sm font-black text-text-primary">{totalBookings}</span>
            </div>

            {/* Tech Load Capacity */}
            <div className="p-3 rounded-xl bg-surface-raised border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Wrench size={15} className="text-indigo" />
                  <span className="text-xs text-text-primary font-medium">Tech Capacity</span>
                </div>
                <span className="text-xs font-bold text-text-secondary">{busyTechs}/{totalTechs} busy</span>
              </div>
              <div className="h-1 w-full bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-indigo rounded-full transition-all"
                  style={{ width: `${totalTechs > 0 ? (busyTechs / totalTechs) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Active emergencies */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border/80">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={15} className={`text-rose-400 ${activeEmergencies > 0 ? "animate-pulse" : ""}`} />
                <span className="text-xs text-text-primary font-medium">Emergencies</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${activeEmergencies > 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "text-text-muted bg-surface"}`}>
                {activeEmergencies} Alert{activeEmergencies === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Financial Placeholders */}
          <div className="pt-6 border-t border-border shrink-0 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-raised border border-border/80">
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Gross Rev</span>
                <span className="text-sm font-black text-text-ghost mt-0.5 block">$ —</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-raised border border-border/80">
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Net profit</span>
                <span className="text-sm font-black text-text-ghost mt-0.5 block">$ —</span>
              </div>
            </div>
            <p className="text-[9px] text-text-muted text-center leading-normal">
              Billing integration modules pending clearance configuration.
            </p>
          </div>
        </div>

        {/* Right Column: Intelligence Panel (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
          
          {/* Top Section: Category Demand Cards */}
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
            <div className="border-b border-border/50 pb-4">
              <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
                <Award className="text-gold" size={18} />
                <span>Service Category Demand</span>
              </h2>
              <p className="text-xs text-text-muted">Ranked demand based on platform bookings volume</p>
            </div>

            {!stats || stats.categoryDemand.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-xs border border-dashed border-border rounded-xl flex-1 flex items-center justify-center">
                No active categories.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 flex-1 pt-4">
                {stats.categoryDemand.slice(0, 4).map((cat) => {
                  const Icon = getCategoryIcon(cat.category);
                  return (
                    <div
                      key={cat.category}
                      className="p-5 rounded-2xl bg-surface-raised border border-border hover:border-border-hover hover:scale-[1.01] transition-all flex flex-col justify-between min-h-[110px]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-surface border border-border text-gold">
                          <Icon size={14} />
                        </div>
                        <span className="text-2xl font-black font-heading text-text-primary">{cat.count}</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-text-primary truncate uppercase tracking-wider">
                          {cat.category || "General Services"}
                        </h3>
                        <p className="text-[9px] text-text-muted mt-0.5">Platform requests count</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Section: Horizontal Dispatch Roadmap */}
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8 space-y-6">
            <div className="border-b border-border/50 pb-4">
              <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
                <Calendar className="text-gold" size={18} />
                <span>Dispatch Schedules Roadmap</span>
              </h2>
              <p className="text-xs text-text-muted">Horizontal calendar timeline tracking job density</p>
            </div>

            {!stats || stats.dailySchedules.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-xs border border-dashed border-border rounded-xl">
                Roadmap is empty.
              </div>
            ) : (
              <div className="relative flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold">
                {stats.dailySchedules.slice(0, 7).map((item) => (
                  <div
                    key={item.date}
                    className="min-w-[130px] p-4 rounded-xl bg-surface-raised border border-border flex flex-col justify-between hover:border-border-hover transition-colors text-center shrink-0 space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider">
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="text-xs font-bold text-text-primary block mt-1">
                        {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <span className="mx-auto px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-[9px] font-extrabold tracking-wider uppercase">
                      {item.count} Job{item.count === 1 ? "" : "s"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
