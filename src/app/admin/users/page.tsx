"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Trash2,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  User,
  Sparkles,
  ChevronRight,
  Shield
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

export default function AdminUsersPage() {
  const { getToken, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.message || "Failed to load user profiles.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users due to a network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "ADMIN") {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActioningId(userId);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert(data.message || "Failed to update role.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleting(true);
    try {
      const token = getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setSelectedUserId(null);
        setConfirmDelete(false);
      } else {
        alert(data.message || "Failed to delete user profile.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "COORDINATOR":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "TECHNICIAN":
        return "bg-indigo/10 text-indigo border border-indigo/20";
      case "CUSTOMER":
      default:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return ShieldAlert;
      case "COORDINATOR":
        return ShieldCheck;
      case "TECHNICIAN":
        return Wrench;
      case "CUSTOMER":
      default:
        return User;
    }
  };

  const filteredUsers = users.filter((u) => {
    const role = u.role || "CUSTOMER";
    const matchesRole = roleFilter === "ALL" || role.toUpperCase() === roleFilter;

    const name = u.name || "";
    const email = u.email || "";
    const phone = u.phone || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;
  const SelectedRoleIcon = selectedUser ? getRoleIcon(selectedUser.role || "CUSTOMER") : User;

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold-glow blur-[140px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-2">
            <Sparkles size={14} />
            <span>Clearance Console</span>
          </div>
          <h1 className="text-3xl font-black font-heading text-text-primary">
            Manage <span className="text-gold">Users</span>
          </h1>
          <p className="mt-1.5 text-text-secondary text-xs">
            Admin console directory. Toggle account roles or terminate account access from the split manager.
          </p>
        </div>
      </div>

      {/* Master-Detail Split Screen Layout */}
      <div className="flex-1 grid gap-8 lg:grid-cols-3 items-stretch min-h-[550px]">
        
        {/* Left Directory Sidebar (Master View) */}
        <div className="lg:col-span-1 rounded-3xl border border-border bg-surface flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border space-y-3 shrink-0">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-text-muted" size={15} />
              <input
                type="text"
                placeholder="Search directory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-raised border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["ALL", "CUSTOMER", "COORDINATOR", "TECHNICIAN", "ADMIN"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider transition-all border ${
                    roleFilter === role
                      ? "bg-gold text-obsidian border-gold shadow-md"
                      : "bg-surface-raised text-text-secondary border-border hover:bg-surface-hover"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Directory List */}
          <div className="flex-1 overflow-y-auto max-h-[420px] p-2 space-y-1.5">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-surface-raised/40 border border-border/50 animate-pulse" />
              ))
            ) : error ? (
              <p className="text-center text-xs text-red-400 py-6">{error}</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-xs text-text-muted py-8">No matching records found.</p>
            ) : (
              filteredUsers.map((item) => {
                const isSelected = item.id === selectedUserId;
                const isSelf = item.id === currentUser?.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedUserId(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-gold/10 border-gold/30 text-text-primary shadow-sm"
                        : "bg-transparent border-transparent hover:bg-surface-raised/50 hover:border-border/30 text-text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8.5 h-8.5 rounded-lg bg-surface-raised border overflow-hidden flex items-center justify-center font-bold text-xs text-gold font-heading shrink-0 ${isSelected ? "border-gold/30" : "border-border"}`}>
                        {item.avatar ? (
                          <img src={item.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          (item.name?.[0] || item.email?.[0] || "?").toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? "text-gold" : "text-text-primary"}`}>
                          {item.name || "Unnamed User"} {isSelf && "(You)"}
                        </p>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">{item.email}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-text-muted shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Console (Detail View) */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-surface p-6 md:p-8 flex flex-col justify-between overflow-hidden relative">
          
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-gold-glow blur-[80px] pointer-events-none" />

          {selectedUser ? (
            <motion.div
              key={selectedUser.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 flex flex-col justify-between h-full"
            >
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-border overflow-hidden flex items-center justify-center font-bold text-gold text-2xl font-heading shrink-0 shadow-lg">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      (selectedUser.name?.[0] || selectedUser.email?.[0] || "?").toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-black font-heading text-text-primary leading-tight">
                      {selectedUser.name || "Unnamed Profile"}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase ${getRoleBadgeClass(
                        selectedUser.role || "CUSTOMER"
                      )}`}
                    >
                      <SelectedRoleIcon size={9} />
                      <span>{selectedUser.role || "CUSTOMER"}</span>
                    </span>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-border">
                  <div className="p-4 rounded-xl bg-surface-raised border border-border/80">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Email Address</span>
                    <span className="text-xs text-text-primary flex items-center gap-1.5 truncate">
                      <Mail size={13} className="text-text-muted shrink-0" />
                      {selectedUser.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-raised border border-border/80">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Phone Number</span>
                    <span className="text-xs text-text-primary flex items-center gap-1.5">
                      <Phone size={13} className="text-text-muted shrink-0" />
                      {selectedUser.phone || "No phone added"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-raised border border-border/80 sm:col-span-2">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Joined Date</span>
                    <span className="text-xs text-text-primary flex items-center gap-1.5">
                      <Calendar size={13} className="text-text-muted shrink-0" />
                      {new Date(selectedUser.createdAt).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {/* Administration Action Panels */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Administrative Clearance</h3>
                  
                  {/* Action: Role Change */}
                  <div className="p-4 rounded-xl bg-surface-raised border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-text-primary block">Authority Role</span>
                      <p className="text-[10px] text-text-secondary">Modify system-wide access permissions.</p>
                    </div>

                    {selectedUser.id === currentUser?.id ? (
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">ADMIN (Master Account)</span>
                    ) : (
                      <select
                        value={(selectedUser.role || "CUSTOMER").toUpperCase()}
                        disabled={actioningId === selectedUser.id}
                        onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                        className="bg-surface border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option 
                          value="COORDINATOR" 
                          disabled={(selectedUser.role || "CUSTOMER").toUpperCase() === "CUSTOMER"}
                        >
                          Coordinator
                        </option>
                        <option value="TECHNICIAN">Technician</option>
                        <option 
                          value="ADMIN" 
                          disabled={(selectedUser.role || "CUSTOMER").toUpperCase() === "COORDINATOR"}
                        >
                          Admin
                        </option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Action: Delete */}
              {selectedUser.id !== currentUser?.id && (
                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-rose-400 block">Account Termination</span>
                    <p className="text-[10px] text-text-muted">Revoke access and clear profile credentials.</p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                  >
                    Terminate User
                  </button>
                </div>
              )}

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl text-gold/30">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Clearance Directory</h3>
                <p className="text-xs text-text-muted mt-1.5 max-w-xs">
                  Select a user profile from the left directory sidebar list to adjust clearance roles or delete profiles.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-text-primary">Confirm User Deletion</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Are you sure you want to permanently delete the profile for{" "}
                    <strong className="text-text-primary">
                      {selectedUser.name || selectedUser.email}
                    </strong>
                    ? This action is irreversible.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-surface-raised border border-border hover:bg-surface-hover text-text-primary rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
