"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();

    // Hide Navbar on /login and /signup pages
    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }

    const isLoggedIn = Boolean(user);

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0A0B10]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] px-8 py-4 transition-all duration-300 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                {/* ================= LEFT: BRAND LOGO ================= */}
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A55E] to-[#A08844] flex items-center justify-center font-bold text-lg text-[#08090D] shadow-lg shadow-[#C8A55E]/10 group-hover:scale-105 transition-transform">
                            F
                        </div>
                        <span className="font-outfit font-bold text-2xl text-[#ECEDF0] tracking-tight group-hover:text-[#E4D5A8] transition-colors">
                            Field<span className="text-[#C8A55E]">Flow</span>
                        </span>
                    </a>
                </div>

                {/* ================= CENTER: NAVIGATION LABELS ================= */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10 text-base font-medium font-inter text-[#9CA0AE]">
                    {isLoggedIn && (
                        <a
                            href="/dashboard"
                            className={`transition-colors text-[#C8A55E] hover:text-[#E4D5A8] font-semibold ${pathname === '/dashboard' ? 'underline underline-offset-8 decoration-[#C8A55E]' : ''}`}
                        >
                            Home
                        </a>
                    )}
                    <a
                        href="/about"
                        className={`transition-colors hover:text-[#ECEDF0] ${pathname === '/about' ? 'text-[#ECEDF0] font-semibold' : ''}`}
                    >
                        About Us
                    </a>

                </div>

                {/* ================= RIGHT: AUTH STATE & PROFILE ================= */}
                <div className="flex items-center gap-5">
                    {isLoggedIn ? (
                        /* ================= LOGGED IN STATE ================= */
                        <div className="flex items-center gap-5">

                            {/* Notification Bell */}
                            <button
                                className="relative text-[#9CA0AE] hover:text-[#ECEDF0] p-2.5 rounded-xl bg-[#14161E]/50 hover:bg-[#14161E] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all focus:outline-none"
                                aria-label="Notifications"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#C8A55E] rounded-full animate-pulse"></span>
                            </button>

                            {/* User Avatar Button & Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#14161E]/80 border border-transparent hover:border-[rgba(255,255,255,0.06)] transition-all focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A1D28] to-[#20232F] border border-[rgba(200,165,94,0.3)] text-[#C8A55E] font-outfit font-bold text-base flex items-center justify-center shadow-inner overflow-hidden">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0) || user?.email?.charAt(0) || "U"
                                        )}
                                    </div>
                                </button>

                                {/* Glassmorphic Profile Card Dropdown */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-[#0A0B10]/95 backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden font-inter text-[#ECEDF0] animate-fade-in-up">

                                        {/* Header with Centered Avatar */}
                                        <div className="p-6 bg-[#14161E]/80 border-b border-[rgba(255,255,255,0.06)] flex flex-col items-center text-center">

                                            {/* Centered Profile Picture */}
                                            <div className="w-16 h-16 rounded-full bg-[#0A0B10] border-2 border-[rgba(200,165,94,0.4)] text-[#C8A55E] font-outfit font-bold text-2xl flex items-center justify-center shadow-lg mb-3 overflow-hidden">
                                                {user?.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.name?.charAt(0) || user?.email?.charAt(0) || "U"
                                                )}
                                            </div>

                                            <h4 className="text-base font-semibold text-[#ECEDF0] font-outfit truncate max-w-full">
                                                {user?.name || "User Profile"}
                                            </h4>
                                            <span className="inline-block text-[10px] font-mono tracking-wider text-[#C8A55E] bg-[#08090D] px-2.5 py-0.5 rounded-full border border-[rgba(200,165,94,0.2)] mt-1">
                                                {user?.role || "CUSTOMER"}
                                            </span>
                                        </div>

                                        {/* Detailed User Information List */}
                                        <div className="p-5 space-y-3.5 bg-[#0A0B10]/60 border-b border-[rgba(255,255,255,0.06)] text-xs">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-[#5C6070] font-medium block mb-0.5">
                                                    Full Name
                                                </span>
                                                <p className="text-sm font-medium text-[#ECEDF0]">
                                                    {user?.name || "Not Set"}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-[#5C6070] font-medium block mb-0.5">
                                                    Email Address
                                                </span>
                                                <p className="text-sm font-medium text-[#ECEDF0] truncate">
                                                    {user?.email || "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-[#5C6070] font-medium block mb-0.5">
                                                    Phone Number
                                                </span>
                                                <p className="text-sm font-medium text-[#ECEDF0]">
                                                    {user?.phone || user?.phoneNumber || "+91 98765 43210"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions: Edit Profile & Logout */}
                                        <div className="p-3 bg-[#0A0B10] space-y-1.5">
                                            <a
                                                href="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] rounded-xl hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all active:scale-[0.98]"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Profile
                                            </a>

                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ECEDF0] hover:bg-[#14161E] hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-[rgba(255,255,255,0.06)]"
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log Out
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ================= GUEST STATE ================= */
                        <div className="flex items-center gap-4">
                            <a
                                href="/login"
                                className="text-base font-medium font-inter text-[#9CA0AE] hover:text-[#ECEDF0] hover:bg-[#14161E]/50 px-4 py-2 rounded-xl transition-colors border border-transparent hover:border-[rgba(255,255,255,0.06)]"
                            >
                                Log In
                            </a>

                            <a
                                href="/signup"
                                className="relative group overflow-hidden text-base font-semibold font-inter text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all active:scale-[0.98]"
                            >
                                <span className="relative z-10">Sign Up</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                            </a>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}