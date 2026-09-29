"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserPlus
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  avatar: string | null;
  createdAt: string;
}

export default function AdminCoordinatorsPage() {
  const { getToken, user: currentUser } = useAuth();
  const [coordinators, setCoordinators] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // Create new coordinator form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [creatingCoordinator, setCreatingCoordinator] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);
  const [creationError, setCreationError] = useState<string | null>(null);

  const fetchCoordinators = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const coordinatorsRes = await fetch(`${API_URL}/admin/coordinators`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!coordinatorsRes.ok) {
        throw new Error("Failed to load coordinators data.");
      }

      const coordinatorsData = await coordinatorsRes.json();

      if (coordinatorsData.success) {
        setCoordinators(coordinatorsData.data.coordinators);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load coordinator configurations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "ADMIN") {
      fetchCoordinators();
    }
  }, [currentUser]);

  const handleDemote = async (userId: string) => {
    if (!confirm("Are you sure you want to demote this coordinator to customer?")) return;
    setPromotingId(userId);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: "CUSTOMER" })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCoordinators((prev) => prev.filter((c) => c.id !== userId));
      } else {
        alert(data.message || "Failed to demote coordinator.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setPromotingId(null);
    }
  };

  const handleCreateCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCoordinator(true);
    setCreationError(null);
    setCreationSuccess(null);

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setCreationError("Name, email, and password are required.");
      setCreatingCoordinator(false);
      return;
    }

    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      // 1. Register the new account (creates user with role CUSTOMER)
      const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          password: newPassword,
          phone: newPhone.trim() || undefined
        })
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok || !signupData.success) {
        throw new Error(signupData.message || "Failed to register user credentials.");
      }

      const newUserId = signupData.data.user.id;

      // 2. Promote the new user to COORDINATOR
      const promoteRes = await fetch(`${API_URL}/admin/users/${newUserId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: "COORDINATOR" })
      });

      const promoteData = await promoteRes.json();
      if (!promoteRes.ok || !promoteData.success) {
        throw new Error(promoteData.message || "Failed to elevate user to Coordinator role.");
      }

      // 3. Prepend the new coordinator local state list
      const newCoordinatorObj: UserProfile = {
        id: newUserId,
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || null,
        role: "COORDINATOR",
        avatar: null,
        createdAt: new Date().toISOString()
      };

      setCoordinators((prev) => [newCoordinatorObj, ...prev]);

      // Reset form states
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewPhone("");
      setCreationSuccess("Coordinator account created and activated successfully!");
      
      // Auto dismiss success toast
      setTimeout(() => setCreationSuccess(null), 5000);
    } catch (err: any) {
      console.error(err);
      setCreationError(err.message || "A network error occurred. Please try again.");
    } finally {
      setCreatingCoordinator(false);
    }
  };

  // Search filter for active coordinators
  const filteredCoordinators = coordinators.filter((c) => {
    const name = c.name || "";
    const email = c.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-10">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold-glow blur-[140px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-3">
              <ShieldCheck size={14} />
              <span>Administrative Roles</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-heading text-text-primary">
              System <span className="text-gold">Coordinators</span>
            </h1>
            <p className="mt-2 text-text-secondary max-w-xl text-sm">
              View active coordinator operations, demote staff back to customer tiers, or register new coordinator accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Coordinators List (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-text-primary flex items-center gap-2">
              <UserCheck className="text-gold" size={20} />
              <span>Active Coordinators ({filteredCoordinators.length})</span>
            </h2>
            <div className="relative flex items-center w-full sm:max-w-xs">
              <Search className="absolute left-3 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search coordinators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 rounded-2xl bg-surface border border-border animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
          ) : filteredCoordinators.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center text-text-secondary">
              No active coordinators match your criteria.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredCoordinators.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  className="rounded-2xl border border-border bg-surface p-5 hover:border-border-hover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 overflow-hidden flex items-center justify-center font-bold text-amber-400 text-base font-heading">
                        {c.avatar ? (
                          <img src={c.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          (c.name?.[0] || c.email?.[0] || "?").toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-text-primary truncate">{c.name || "Coordinator"}</h3>
                        <span className="inline-block mt-0.5 text-[9px] font-extrabold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                          Coordinator
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-text-secondary">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail size={12} className="text-text-muted shrink-0" />
                        {c.email}
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1.5 shrink-0">
                          <Phone size={12} className="text-text-muted shrink-0" />
                          {c.phone}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 shrink-0">
                        <Calendar size={12} className="text-text-muted shrink-0" />
                        Joined: {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDemote(c.id)}
                    disabled={promotingId === c.id}
                    className="mt-5 w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Demote Role
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create Coordinator Form Tool (Right Column) */}
        <div className="rounded-3xl border border-border bg-surface p-6 space-y-6">
          <div className="border-b border-border/50 pb-4">
            <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
              <UserPlus className="text-gold" size={18} />
              <span>Create Coordinator</span>
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Register new coordinator login credentials directly.
            </p>
          </div>

          <form onSubmit={handleCreateCoordinator} className="space-y-4">
            {creationSuccess && (
              <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-semibold">
                {creationSuccess}
              </div>
            )}

            {creationError && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
                {creationError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+91-9988776655"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Credentials Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={creatingCoordinator}
              className="w-full mt-4 py-3 bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{creatingCoordinator ? "Creating..." : "Create & Promote"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
