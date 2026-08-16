"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Lock,
  Activity,
  ChevronLeft,
  Mail,
  Phone,
  Shield,
  Calendar,
  Check,
  AlertTriangle,
  RefreshCw,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const { getToken, user } = useAuth();
  
  const [profile, setProfile] = useState<AdminProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "logs">("personal");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Personal form fields
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast("error", "No authentication token found. Please log in.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/admin/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load profile (${res.status})`);
      }

      const data = await res.json();
      if (data.success && data.data) {
        const adminData = data.data.profile || data.data;
        setProfile({
          id: adminData.id || "",
          name: adminData.name || "Administrator",
          email: adminData.email || "",
          phone: adminData.phone || "",
          role: adminData.role || "ADMIN",
          createdAt: adminData.createdAt || new Date().toISOString(),
          avatar: adminData.avatar || "",
        });
        setNameInput(adminData.name || "");
        setPhoneInput(adminData.phone || "");
        setActivities(data.data.activities || []);
      } else {
        throw new Error(data.message || "Failed to load admin profile.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Network error loading admin profile.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, getToken, showToast]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast("error", "Name cannot be empty.");
      return;
    }

    try {
      setIsUpdating(true);
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nameInput,
          phone: phoneInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfile(prev => ({
        ...prev,
        name: nameInput,
        phone: phoneInput,
      }));
      showToast("success", "Profile details updated successfully.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("error", "All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Confirm password does not match new password.");
      return;
    }

    try {
      setIsUpdating(true);
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to change password.");
      }

      showToast("success", "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast("error", err.message || "Failed to change password.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#C8A55E] animate-spin" />
          <span className="text-sm text-[#9CA0AE]">Loading admin profile...</span>
        </div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "AD";

  return (
    <div className="min-h-screen bg-[#0D0F17] text-[#ECEDF0] py-6 sm:py-10">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-4">
        
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C8A55E] mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-bold font-outfit text-white tracking-tight">
              Admin Profile
            </h1>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#9CA0AE] hover:text-white border border-gray-800 rounded-xl hover:bg-white/5 transition-all shrink-0 w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Card: Summary */}
          <div className="lg:col-span-1 bg-[#10121A] border border-gray-800 rounded-2xl p-6 text-center space-y-6">
            
            {/* Avatar block */}
            <div className="mx-auto w-24 h-24 rounded-full bg-[#181B26] border-2 border-[#C8A55E]/40 text-[#C8A55E] flex items-center justify-center text-3xl font-bold font-outfit shadow-lg shadow-[#C8A55E]/5">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                initials
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
              <span className="inline-block text-[10px] font-bold bg-[#C8A55E]/10 text-[#C8A55E] border border-[#C8A55E]/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                {profile.role}
              </span>
              <p className="text-xs text-[#9CA0AE] pt-1">{profile.email}</p>
            </div>

            {/* Meta details list */}
            <div className="border-t border-gray-800/80 pt-6 text-left space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#9CA0AE]">
                <Mail className="w-4 h-4 text-[#C8A55E] shrink-0" />
                <span className="truncate">{profile.email || "No email available"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#9CA0AE]">
                <Phone className="w-4 h-4 text-[#C8A55E] shrink-0" />
                <span>{profile.phone || "No phone number"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#9CA0AE]">
                <Calendar className="w-4 h-4 text-[#C8A55E] shrink-0" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

          </div>

          {/* Right Tabs / Card: Profile Management */}
          <div className="lg:col-span-2 bg-[#10121A] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
            
            {/* Tab navigation */}
            <div className="flex border-b border-gray-800 bg-[#0E1018]">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex-1 py-4 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === "personal"
                    ? "border-[#C8A55E] text-[#C8A55E] bg-white/[0.02]"
                    : "border-transparent text-[#9CA0AE] hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Details
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-4 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === "security"
                    ? "border-[#C8A55E] text-[#C8A55E] bg-white/[0.02]"
                    : "border-transparent text-[#9CA0AE] hover:text-white"
                }`}
              >
                <Lock className="w-4 h-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`flex-1 py-4 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === "logs"
                    ? "border-[#C8A55E] text-[#C8A55E] bg-white/[0.02]"
                    : "border-transparent text-[#9CA0AE] hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4" />
                System Logs
              </button>
            </div>

            {/* Tab contents */}
            <div className="p-6 sm:p-8 flex-1">
              
              {/* Personal Details Form */}
              {activeTab === "personal" && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Admin Name"
                        className="w-full bg-[#141620] border border-gray-800 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full bg-[#141620] border border-gray-800 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                        Role / Department
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.role}
                        className="w-full bg-[#141620]/40 border border-gray-800/60 rounded-xl px-4 py-3 text-sm text-[#9CA0AE] font-semibold cursor-not-allowed uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full bg-[#141620]/40 border border-gray-800/60 rounded-xl px-4 py-3 text-sm text-[#9CA0AE] cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-800/50">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {/* Security settings Form */}
              {activeTab === "security" && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#141620] border border-gray-800 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#141620] border border-gray-800 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#141620] border border-gray-800 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-800/50">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-bold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}

              {/* Activity Logs / System Status */}
              {activeTab === "logs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="text-xs font-semibold text-[#9CA0AE] uppercase tracking-wider">
                      Recent System Actions
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      Live Status
                    </span>
                  </div>
                  <div className="divide-y divide-gray-800/60 max-h-80 overflow-y-auto pr-1">
                    {activities.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#9CA0AE] italic">
                        No recent administration activities logged.
                      </div>
                    ) : (
                      activities.map((act) => (
                        <div key={act.id} className="py-3.5 flex items-start gap-4 hover:bg-white/[0.01] px-2 rounded-lg transition-colors">
                          <div className="p-2 rounded-lg bg-[#181B26] border border-gray-800 text-[#C8A55E] shrink-0 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-sm font-semibold text-white truncate">{act.action}</p>
                              <span className="text-[10px] text-[#9CA0AE] shrink-0">
                                {new Date(act.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#9CA0AE] mt-0.5 leading-normal">{act.details}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
