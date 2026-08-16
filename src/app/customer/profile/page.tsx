"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Matches exact fields from your 'profiles' database table
interface ProfileData {
    id?: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    street: string;
    city: string;
    postalCode: string;
    avatar: string;
    age?: string;
}

export default function CustomerProfilePage() {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        phone: "",
        gender: "",
        role: "customer",
        street: "",
        city: "",
        postalCode: "",
        avatar: "",
        age: "",
    });

    // Dedicated Form State for editing (matches technician profile pattern)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        age: "",
        street: "",
        city: "",
        postalCode: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const previewUrlRef = useRef<string | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const AVATAR_UPLOAD_URL =
        process.env.NEXT_PUBLIC_AVATAR_UPLOAD_URL || `${API_BASE_URL}/user/profile/avatar`;

    // Safe helper to retrieve token from all common localStorage keys
    const getStoredToken = (): string => {
        if (typeof window === "undefined") return "";
        const directToken =
            localStorage.getItem("token") ||
            localStorage.getItem("homefixpro_token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("sb-access-token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("auth_token");

        if (directToken) return directToken;

        const sbKey = Object.keys(localStorage).find((k) => k.includes("auth-token"));
        if (sbKey) {
            try {
                const parsed = JSON.parse(localStorage.getItem(sbKey) || "{}");
                if (parsed?.access_token) return parsed.access_token;
            } catch (e) {
                // Ignore parse errors
            }
        }
        return "";
    };

    // 1. FETCH FROM PROFILES TABLE
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const token = getStoredToken();

            if (!token) {
                setErrorMessage("No authentication token found in browser session. Please log in.");
                setIsLoading(false);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/user/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch profile (${res.status})`);
            }

            const responseData = await res.json();
            const profileObj = responseData?.data?.user || responseData?.data || responseData;

            const loadedData: ProfileData = {
                id: profileObj.id || "",
                name: profileObj.name || "",
                email: profileObj.email || "",
                phone: profileObj.phone || "",
                gender: profileObj.gender || "",
                role: profileObj.role || "customer",
                street: profileObj.street || "",
                city: profileObj.city || "",
                postalCode: profileObj.postalCode || "",
                avatar: profileObj.avatar || "",
                age: profileObj.age ? String(profileObj.age) : "",
            };

            setProfile(loadedData);
        } catch (err: any) {
            console.error("Profile Fetch Error:", err.message);
            setErrorMessage(err.message || "Failed to load profile data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [API_BASE_URL]);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    // Toggle Edit Mode & Initialize/Reset Form Data
    const handleEditToggle = () => {
        if (!isEditing) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                age: profile.age || "",
                street: profile.street || "",
                city: profile.city || "",
                postalCode: profile.postalCode || "",
            });
        }
        setIsEditing(!isEditing);
        setErrorMessage("");
        setSaveSuccess(false);
    };

    // Generic Form Change Handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Local Image Upload Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
            const imageUrl = URL.createObjectURL(file);
            previewUrlRef.current = imageUrl;
            setAvatarPreview(imageUrl);
            setSelectedAvatarFile(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // 2. SAVE CHANGES TO PROFILES TABLE
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSaveSuccess(false);
        setIsSaving(true);

        try {
            const token = getStoredToken();

            if (!token) {
                setErrorMessage("Authentication token missing. Please log in again.");
                setIsSaving(false);
                return;
            }

            let avatarUrl = profile.avatar;

            if (selectedAvatarFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("avatar", selectedAvatarFile);

                const uploadRes = await fetch(AVATAR_UPLOAD_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: uploadFormData,
                });

                const uploadData = await uploadRes.json().catch(() => ({}));
                if (!uploadRes.ok || uploadData.success === false) {
                    throw new Error(
                        uploadData.message || `Failed to upload profile image (${uploadRes.status})`
                    );
                }

                const uploadedAvatarUrl =
                    uploadData?.data?.avatar ||
                    uploadData?.data?.url ||
                    uploadData?.data?.imageUrl ||
                    uploadData?.data?.secure_url ||
                    uploadData?.avatar ||
                    uploadData?.url ||
                    uploadData?.imageUrl ||
                    uploadData?.secure_url;

                if (typeof uploadedAvatarUrl !== "string" || !uploadedAvatarUrl) {
                    throw new Error("Profile image upload did not return an image URL.");
                }

                avatarUrl = uploadedAvatarUrl;
            }

            const payload = {
                name: formData.name,
                phone: formData.phone,
                gender: profile.gender,
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode,
                avatar: avatarUrl,
                age: formData.age ? Number(formData.age) : undefined,
            };

            const res = await fetch(`${API_BASE_URL}/user/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error("PUT /user/profile failed:", res.status, errorBody);
                let msg = `Failed to update profile (${res.status})`;
                try {
                    const parsed = JSON.parse(errorBody);
                    if (parsed.message) msg = parsed.message;
                } catch {
                    // Raw text fallback
                }
                throw new Error(msg);
            }

            const responseData = await res.json();
            const updatedUser = responseData?.data?.user || responseData?.data || responseData;

            const finalAge = updatedUser.age ? String(updatedUser.age) : profile.age;

            // Update global user state in AuthContext so components like Navbar re-render instantly
            updateUser({
                name: updatedUser.name ?? profile.name,
                phone: updatedUser.phone ?? profile.phone,
                street: updatedUser.street ?? profile.street,
                city: updatedUser.city ?? profile.city,
                postalCode: updatedUser.postalCode ?? profile.postalCode,
                avatar: updatedUser.avatar ?? avatarUrl,
                age: finalAge ? Number(finalAge) : undefined,
            });

            // Update base profile state with newly returned server data
            setProfile((prev) => ({
                ...prev,
                name: updatedUser.name ?? prev.name,
                phone: updatedUser.phone ?? prev.phone,
                gender: updatedUser.gender ?? prev.gender,
                street: updatedUser.street ?? prev.street,
                city: updatedUser.city ?? prev.city,
                postalCode: updatedUser.postalCode ?? prev.postalCode,
                avatar: updatedUser.avatar ?? avatarUrl,
                age: finalAge,
            }));

            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
            setAvatarPreview("");
            setSelectedAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setErrorMessage(err.message || "Something went wrong while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#08090D] text-white flex flex-col items-center justify-center font-inter gap-3">
                <RefreshCw className="w-8 h-8 text-[#C8A55E] animate-spin" />
                <span className="text-sm font-medium text-[#9CA0AE]">Loading profile details...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-white font-outfit tracking-tight">
                        Account Profile
                    </h1>
                    <p className="text-xs text-[#9CA0AE] mt-1">
                        Manage your personal information, profile picture, and default service address.
                    </p>
                </div>

                {/* Alerts */}
                {saveSuccess && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>Profile details updated successfully!</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 font-medium">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-8 shadow-2xl">
                    {/* Header Section (Avatar & Edit Button Top-Right) */}
                    <div className="flex items-start justify-between pb-6 border-b border-[rgba(255,255,255,0.08)]">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group">
                                <div
                                    onClick={triggerFileInput}
                                    className="w-24 h-24 rounded-full bg-[#14161E] border-2 border-[#C8A55E]/40 text-[#C8A55E] flex items-center justify-center text-3xl font-bold font-outfit overflow-hidden cursor-pointer shadow-lg shadow-[#C8A55E]/10 group-hover:border-[#C8A55E] transition-all"
                                >
                                    {avatarPreview || profile.avatar ? (
                                        <img
                                            src={avatarPreview || profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        profile.name ? profile.name.charAt(0).toUpperCase() : "U"
                                    )}

                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <span>📷</span>
                                        <span className="font-semibold">Change</span>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="text-center sm:text-left space-y-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                                    <h2 className="text-xl font-bold text-white font-outfit">
                                        {profile.name || "User Name"}
                                    </h2>
                                    <span className="text-[10px] font-semibold bg-[#C8A55E]/10 text-[#C8A55E] border border-[#C8A55E]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                        {profile.role}
                                    </span>
                                </div>

                                <p className="text-xs text-[#9CA0AE]">{profile.email}</p>

                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="text-xs text-[#C8A55E] hover:underline font-medium inline-block pt-1 cursor-pointer"
                                >
                                    Upload new picture
                                </button>
                            </div>
                        </div>

                        {/* Top Right Edit Button Toggle (Technician Profile Style) */}
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171922] hover:bg-[#202330] border border-white/10 text-white transition-all cursor-pointer"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-[#C8A55E]" /> Edit
                            </button>
                        )}
                    </div>

                    {/* Profile Fields Form */}
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-4">
                                Personal Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        disabled={!isEditing}
                                        value={isEditing ? formData.name : profile.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        disabled={!isEditing}
                                        value={isEditing ? formData.phone : profile.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        disabled={!isEditing}
                                        value={isEditing ? formData.age : profile.age}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="120"
                                        placeholder="Enter your age"
                                        className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Gender
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={profile.gender || "Not specified"}
                                        className="w-full bg-[#14161E]/50 border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-[#9CA0AE] cursor-not-allowed capitalize"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Account Role
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={profile.role}
                                        className="w-full bg-[#14161E]/50 border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-[#9CA0AE] font-semibold cursor-not-allowed capitalize"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        value={profile.email}
                                        className="w-full bg-[#14161E]/50 border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-[#9CA0AE] cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-4">
                                Default Service Address
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        disabled={!isEditing}
                                        value={isEditing ? formData.street : profile.street}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            disabled={!isEditing}
                                            value={isEditing ? formData.city : profile.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-[#9CA0AE] mb-1.5 font-medium">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            disabled={!isEditing}
                                            value={isEditing ? formData.postalCode : profile.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions (Shown only during Edit Mode) */}
                        {isEditing && (
                            <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleEditToggle}
                                    className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#9CA0AE] hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
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
        </div>
    );
}