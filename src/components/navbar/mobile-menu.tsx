"use client";

import React from "react";
import Link from "next/link";
import { RoleBadge } from "./role-badge";
import { NavLink } from "./nav-link";
import { getNavLinksForRole, isNavItemActive } from "@/lib/nav-config";

interface MobileMenuProps {
    isLoggedIn: boolean;
    user: any;
    role: string | null;
    initials: string;
    pathname: string;
    notificationPath: string;
    mobileMenuOpen: boolean;
    mobileMenuRef: React.RefObject<HTMLDivElement | null>;
    setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
    unreadCount: number;
}

export function MobileMenu({
    isLoggedIn,
    user,
    role,
    initials,
    pathname,
    notificationPath,
    mobileMenuOpen,
    mobileMenuRef,
    setMobileMenuOpen,
    logout,
    unreadCount,
}: MobileMenuProps) {
    const navItems = getNavLinksForRole(isLoggedIn ? role : null);

    return (
        <div className="relative lg:hidden" ref={mobileMenuRef}>
            <button
                type="button"
                onClick={() => setMobileMenuOpen((value) => !value)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#14161E]/60 border border-[rgba(255,255,255,0.08)] text-[#ECEDF0] hover:bg-[#14161E] transition-colors duration-200 focus:outline-none"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                            mobileMenuOpen
                                ? "M6 18L18 6M6 6l12 12"
                                : "M4 6h16M4 12h16M4 18h16"
                        }
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full border border-[#0A0B10] flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {mobileMenuOpen && (
                <div className="fixed left-3 right-3 top-[72px] z-[60] max-h-[calc(100vh-88px)] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0F1118]/98 shadow-2xl shadow-black/60 backdrop-blur-xl lg:hidden">
                    <div className="p-4 space-y-4">
                        {isLoggedIn ? (
                            <>
                                <div className="px-3 py-2.5 rounded-xl bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A1D28] to-[#20232F] border border-[rgba(200,165,94,0.3)] text-[#C8A55E] font-outfit font-bold text-sm flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
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
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#ECEDF0] truncate">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-[#9CA0AE] truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    {role && (
                                        <div className="mt-2.5">
                                            <RoleBadge role={role} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 px-1">
                                    {navItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            label={item.label}
                                            gold={item.gold}
                                            active={isNavItemActive(item.href, pathname)}
                                            mobile
                                            onClick={() => setMobileMenuOpen(false)}
                                        />
                                    ))}
                                </div>

                                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                                    <Link
                                        href={notificationPath}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm bg-[#14161E]/60 text-[#ECEDF0] border border-[rgba(255,255,255,0.06)] hover:bg-[#14161E] transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="flex h-5 px-2 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[#5C6070]">→</span>
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm bg-[#14161E]/60 text-[#ECEDF0] border border-[rgba(255,255,255,0.06)] hover:bg-[#14161E] transition-colors duration-200"
                                    >
                                        Edit Profile
                                        <span className="text-[#5C6070]">→</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors duration-200"
                                    >
                                        Log Out
                                        <span>↗</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3 px-1">
                                    {navItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            label={item.label}
                                            active={isNavItemActive(item.href, pathname)}
                                            mobile
                                            onClick={() => setMobileMenuOpen(false)}
                                        />
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D]"
                                    >
                                        Sign In
                                        <span>→</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}