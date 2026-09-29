"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";
import GlassButton from "@/components/ui/glass-button";

interface TechnicianApplication {
  id: string;
  userId: string;
  skills: string;
  experience: number;
  license: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
  };
}

export default function CoordinatorApplicationsPage() {
  return (
    <AuthGuard>
      <ApplicationsContent />
    </AuthGuard>
  );
}

function ApplicationsContent() {
  const { getToken, user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Safeguard role access
  useEffect(() => {
    if (user && user.role !== "COORDINATOR" && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/coordinator/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setApplications(data.data.applications);
      } else {
        setError(data.message || "Failed to fetch technician applications.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch applications due to network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "COORDINATOR" || user.role === "ADMIN")) {
      fetchApplications();
    }
  }, [user]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActioningId(id);
    try {
      const token = getToken();

      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      console.log("Token:", token);
console.log("URL:", `${API_URL}/coordinator/applications/${id}/${action}`);
      const response = await fetch(`${API_URL}/coordinator/applications/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local status
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: action === "approve" ? "APPROVED" : "REJECTED" }
              : app
          )
        );
      } else {
        alert(data.message || `Failed to ${action} application.`);
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const name = app.profile?.name || "";
    const email = app.profile?.email || "";
    const skills = app.skills || "";
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-void p-6 md:p-12 text-text-primary">
      {/* Header section */}
      <div className="relative mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-10">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold-glow blur-[140px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-3">
            <Sparkles size={14} />
            <span>Applications Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-text-primary">
            Technician <span className="text-gold">Applications</span>
          </h1>
          <p className="mt-3 text-text-secondary max-w-xl">
            Review applicant profiles, skills, and documentation to approve or reject technician applications.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 self-start md:self-center">
          <GlassButton variant="secondary" onClick={() => router.push("/coordinator/dashboard")}>
            Back to Dashboard
          </GlassButton>
        </div>
      </div>

      {/* Filters & search */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-2 flex flex-wrap gap-2 items-center">
          <Filter className="text-text-muted mr-2" size={16} />
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 border ${
                statusFilter === status
                  ? "bg-gold text-obsidian border-gold shadow-md"
                  : "bg-surface text-text-secondary border-border hover:bg-surface-hover hover:border-border-hover"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-surface animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <GlassButton onClick={fetchApplications}>Try Again</GlassButton>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center">
          <p className="text-text-secondary text-lg mb-2">No applications found</p>
          <p className="text-text-muted text-sm">
            Try checking another filter or searching for a different query.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-border-hover hover:scale-[1.01] transition-all duration-300"
              >
                <div>
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase ${
                        app.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : app.status === "APPROVED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border overflow-hidden flex items-center justify-center font-bold text-xl text-gold font-heading">
                      {app.profile?.avatar ? (
                        <img src={app.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        (app.profile?.name?.[0] || app.profile?.email?.[0] || "?").toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-text-primary">
                        {app.profile?.name || "Applicant Name"}
                      </h3>
                      <div className="flex flex-col gap-1 mt-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} className="text-text-muted" />
                          {app.profile?.email}
                        </span>
                        {app.profile?.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-text-muted" />
                            {app.profile.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-3 py-4 border-t border-b border-border/50 mb-6">
                    <div className="flex items-start gap-2.5 text-sm">
                      <Briefcase size={16} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-text-secondary block text-xs">Experience</span>
                        <span className="font-semibold text-text-primary">
                          {app.experience} {app.experience === 1 ? "year" : "years"} professional experience
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <Award size={16} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-text-secondary block text-xs">Skills & Expertise</span>
                        <span className="font-semibold text-text-primary">{app.skills}</span>
                      </div>
                    </div>

                    {app.license && (
                      <div className="flex items-start gap-2.5 text-sm">
                        <ChevronRight size={16} className="text-gold mt-0.5 shrink-0" />
                        <div>
                          <span className="text-text-secondary block text-xs">Licenses & Certifications</span>
                          <span className="font-semibold text-text-primary">{app.license}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2.5 text-sm">
                      <Calendar size={16} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <span className="text-text-secondary block text-xs">Applied Date</span>
                        <span className="font-medium text-text-secondary">
                          {new Date(app.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {app.status === "PENDING" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction(app.id, "approve")}
                      disabled={actioningId !== null}
                      className="flex-1 py-3 bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian rounded-xl font-bold text-xs tracking-wider uppercase hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
                    >
                      {actioningId === app.id ? "Approve..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "reject")}
                      disabled={actioningId !== null}
                      className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
                    >
                      {actioningId === app.id ? "Reject..." : "Reject"}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
