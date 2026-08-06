"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit2
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  city: string | null;
  street: string | null;
  postalCode: string | null;
  gender: string | null;
  skills: string;
  experience: number;
  license: string;
  status: string;
  rejectionReason: string | null;
  applicationId: string | null;
  createdAt: string | null;
}

export async function getTechnicianProfileService(token: string): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/technicians/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to load profile details.");
  }

  return result.data;
}

export async function updateTechnicianProfileService(
  token: string,
  updatedData: Partial<ProfileData>
): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/technicians/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to update profile details.");
  }

  return result.data;
}

export default function TechnicianProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { getToken, isLoading: authLoading } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    street: "",
    city: "",
    postalCode: "",
    avatar: "",
    skills: "",
    experience: 0,
    license: "",
  });

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      setError("Your session is not available. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const profileData = await getTechnicianProfileService(token);
      setData(profileData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
  }, [authLoading, getToken]);

  const handleEditToggle = () => {
    if (data) {
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        gender: data.gender || "",
        street: data.street || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        avatar: data.avatar || "",
        skills: data.skills || "",
        experience: data.experience || 0,
        license: data.license || "",
      });
    }
    setEditMode(!editMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("Your session is not available. Please log in again.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateTechnicianProfileService(token, formData);
      setData(updated);
      setEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#07080B] flex flex-col items-center justify-center text-[#9CA0AE] gap-3">
        <RefreshCw className="w-8 h-8 text-[#C8A55E] animate-spin" />
        <span className="text-sm font-medium">Loading profile details...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#07080B] flex flex-col items-center justify-center text-rose-400 p-4 text-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <p className="text-lg font-medium">{error || "Profile unavailable."}</p>
        <button
          onClick={fetchProfile}
          className="px-5 py-2.5 bg-[#171922] text-white rounded-xl border border-white/10 text-sm font-medium hover:bg-[#202330] transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const displayAvatar = editMode ? formData.avatar : data.avatar;

  return (
    <main className="min-h-screen bg-[#07080B] text-[#ECEDF0] px-4 py-12 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Alerts */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Profile Card Container */}
        <div className="bg-[#10121A] border border-white/5 rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl">

          {/* Header Section */}
          <div className="flex items-start justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#14161F] border border-white/10 overflow-hidden flex items-center justify-center text-3xl font-light text-amber-100/90 shrink-0 relative">
                {displayAvatar ? (
                  <Image
                    src={displayAvatar}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  data.name?.charAt(0).toUpperCase() || "T"
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                    {data.name || "Technician Name"}
                  </h1>
                  <span className="px-3 py-0.5 text-[11px] font-semibold tracking-wider rounded-full bg-[#C8A55E]/10 text-[#C8A55E] border border-[#C8A55E]/20 uppercase">
                    TECHNICIAN
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-normal">{data.email}</p>

                {/* Upload Button Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#C8A55E] hover:underline font-medium block pt-1 cursor-pointer"
                >
                  Upload new picture
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {!editMode && (
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171922] hover:bg-[#202330] border border-white/10 text-white transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#C8A55E]" /> Edit
              </button>
            )}
          </div>

          {/* Rejection notice if applicable */}
          {data.status === "REJECTED" && data.rejectionReason && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Application Rejected</h3>
                <p className="text-xs mt-1 text-rose-300">{data.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSave} className="space-y-10">

            {/* Section 1: Personal Details */}
            <div className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    disabled={!editMode}
                    value={editMode ? formData.name : data.name || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    disabled={!editMode}
                    value={editMode ? formData.phone : data.phone || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Gender</label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-[#12141D] border border-white/10 focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={data.gender || "Not specified"}
                      className="w-full bg-[#12141D] border border-white/10 opacity-80 cursor-not-allowed rounded-xl px-4 py-3 text-sm text-white font-medium"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Application Status</label>
                  <input
                    type="text"
                    disabled
                    value={data.status?.toUpperCase() || "PENDING"}
                    className="w-full bg-[#12141D] border border-white/10 opacity-80 cursor-not-allowed rounded-xl px-4 py-3 text-sm text-[#C8A55E] font-semibold tracking-wider"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={data.email || ""}
                    className="w-full bg-[#12141D] border border-white/10 opacity-80 cursor-not-allowed rounded-xl px-4 py-3 text-sm text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Default Service Address */}
            <div className="space-y-5 pt-4 border-t border-white/5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Default Service Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    disabled={!editMode}
                    value={editMode ? formData.street : data.street || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    disabled={!editMode}
                    value={editMode ? formData.city : data.city || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    disabled={!editMode}
                    value={editMode ? formData.postalCode : data.postalCode || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional & Application Details */}
            <div className="space-y-5 pt-4 border-t border-white/5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Professional & Application Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    disabled={!editMode}
                    value={editMode ? formData.experience : data.experience || 0}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">License / Certification</label>
                  <input
                    type="text"
                    name="license"
                    disabled={!editMode}
                    value={editMode ? formData.license : data.license || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Skills & Specializations</label>
                  <input
                    type="text"
                    name="skills"
                    disabled={!editMode}
                    value={editMode ? formData.skills : data.skills || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Plumbing, AC Repair, Electrical Work"
                    className="w-full bg-[#12141D] border border-white/10 disabled:opacity-80 disabled:cursor-not-allowed focus:border-[#C8A55E] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            {editMode && (
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-[#171922] text-gray-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#D3B469] hover:bg-[#C8A55E] text-black font-semibold px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}