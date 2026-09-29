"use client";

import React from "react";
import Link from "next/link";
import { RoleBadge } from "./role-badge";

interface ProfileDropdownProps {
    user: any;
    role: string | null;
    initials: string;
    dropdownOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
}

function getProfileRoute(role?: string | null): string {
    const normalizedRole = role ? role.toUpperCase().trim() : "CUSTOMER";

    switch (normalizedRole) {
        case "ADMIN":
            return "/admin/profile";
        case "TECHNICIAN":
        case "TECHNICIAN_PENDING":
            return "/technician/profile";
        case "COORDINATOR":
            return "/coordinator/profile";
        case "CUSTOMER":
        default:
            return "/customer/profile";
    }
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5C6070] font-semibold font-inter block mb-0.5">
                {label}
            </span>
            <p className="text-sm font-medium text-[#ECEDF0] font-inter truncate">
                {value}
            </p>
        </div>
    );
}

export function ProfileDropdown({
    user,
    role,
    initials,
    dropdownOpen,
    dropdownRef,
    setDropdownOpen,
    logout,
}: ProfileDropdownProps) {
    const profilePath = getProfileRoute(role);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                id="navbar-profile-toggle"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#14161E]/70 border border-transparent hover:border-[rgba(255,255,255,0.07)] transition-all duration-200 focus:outline-none"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1A1D28] to-[#20232F] border border-[rgba(200,165,94,0.3)] text-[#C8A55E] font-outfit font-bold text-sm flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </div>
                <svg
                    className={`w-4 h-4 text-[#5C6070] transition-transform duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {dropdownOpen && (
                <div
                    id="navbar-profile-dropdown"
                    className="absolute right-0 mt-3 w-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-[rgba(255,255,255,0.09)]"
                    style={{
                        background: "rgba(20,22,30,0.96)",
                        backdropFilter: "blur(24px)",
                    }}
                >
                    <div className="p-5 bg-[#0A0B10]/60 border-b border-[rgba(255,255,255,0.06)] flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A1D28] to-[#20232F] border-2 border-[rgba(200,165,94,0.35)] text-[#C8A55E] font-outfit font-bold text-2xl flex items-center justify-center shadow-lg mb-3 overflow-hidden">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <h4 className="text-base font-semibold text-[#ECEDF0] font-outfit truncate max-w-full leading-tight">
                            {user?.name || "User"}
                        </h4>
                        <p className="text-xs text-[#9CA0AE] font-inter mt-0.5 truncate max-w-full">
                            {user?.email}
                        </p>
                        {role && (
                            <div className="mt-2.5">
                                <RoleBadge role={role} />
                            </div>
                        )}
                    </div>

                    <div className="px-5 py-4 space-y-3.5 border-b border-[rgba(255,255,255,0.06)]">
                        <InfoRow label="Full Name" value={user?.name || "Not set"} />
                        <InfoRow label="Email Address" value={user?.email || "—"} />
                        <InfoRow label="Phone Number" value={user?.phone || "Not set"} />
                    </div>

                    <div className="p-3 space-y-1.5">
                        <Link
                            href={profilePath}
                            onClick={() => setDropdownOpen(false)}
                            className="relative group overflow-hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold font-inter text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] rounded-xl hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all duration-200 active:scale-[0.98]"
                        >
                            <span>Edit Profile</span>
                        </Link>
                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                logout();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium font-inter text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-all duration-200 border border-rose-500/20"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}