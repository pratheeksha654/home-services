"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

/* ── Role Badge Component ────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  const config: Record<
    string,
    { label: string; color: string; bg: string; border: string }
  > = {
    CUSTOMER: {
      label: "Customer",
      color: "#C8A55E",
      bg: "#C8A55E14",
      border: "#C8A55E30",
    },
    TECHNICIAN: {
      label: "Technician",
      color: "#34D399",
      bg: "#34D39914",
      border: "#34D39930",
    },
    TECHNICIAN_PENDING: {
      label: "Pending Review",
      color: "#FBBF24",
      bg: "#FBBF2414",
      border: "#FBBF2430",
    },
    COORDINATOR: {
      label: "Coordinator",
      color: "#818CF8",
      bg: "#818CF814",
      border: "#818CF830",
    },
    ADMIN: {
      label: "Admin",
      color: "#F87171",
      bg: "#F8717114",
      border: "#F8717130",
    },
  };

  const c = config[role] || config.CUSTOMER;

  return (
    <span
      className="inline-block text-[10px] font-semibold font-mono tracking-wider px-2.5 py-0.5 rounded-full"
      style={{
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      {c.label}
    </span>
  );
}

/* ── Nav Link Component ──────────────────────────────────────────── */
function NavLink({
  href,
  label,
  active,
  gold,
}: {
  href: string;
  label: string;
  active: boolean;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium font-inter transition-colors duration-200 group ${gold
        ? "text-[#C8A55E] hover:text-[#E4D5A8]"
        : active
          ? "text-[#ECEDF0]"
          : "text-[#9CA0AE] hover:text-[#ECEDF0]"
        }`}
    >
      {label}
      {/* Active underline */}
      <span
        className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-[#C8A55E] transition-all duration-300 ${active
          ? "w-full opacity-100"
          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
          }`}
      />
    </Link>
  );
}

/* ── Pending Status Pill Component ───────────────────────────────── */
function PendingStatusPill() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
      <span className="text-xs font-semibold font-inter whitespace-nowrap">
        Application Status
      </span>
    </div>
  );
}

/* ── Dropdown Info Row Component ─────────────────────────────────── */
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

/* ── Main Navbar Component ───────────────────────────────────────── */
export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide Navbar on specific authentication and onboarding routes
  const hiddenRoutes = [
    "/login",
    "/signup",
    "/onboarding/details",
    "/onboarding/role-select",
    "/onboarding/technician",
  ];

  const shouldHideNavbar = hiddenRoutes.some(
    (r) => pathname === r || pathname.startsWith(r)
  );

  // Handle scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (shouldHideNavbar) {
    return null;
  }

  const isLoggedIn = Boolean(user);
  const role = user?.role;

  // Extract avatar initials
  const initials = user?.name
    ? user.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  // Render navigation links dynamically by role
  const renderNavLinks = () => {
    if (role === "CUSTOMER") {
      return (
        <>
          <NavLink
            href="/customer"
            label="Home"
            active={pathname === "/customer"}
          />
          <NavLink
            href="/about"
            label="About Us"
            active={pathname === "/about"}
          />
          <NavLink
            href="/customer/book"
            label="Book Service"
            active={pathname.startsWith("/customer/book")}
            gold
          />
          <NavLink
            href="/customer/services"
            label="My Services"
            active={pathname.startsWith("/customer/services")}
          />
        </>
      );
    }

    if (role === "TECHNICIAN") {
      return (
        <>
          <NavLink
            href="/technician"
            label="Home"
            active={pathname === "/technician"}
          />
          <NavLink
            href="/about"
            label="About Us"
            active={pathname === "/about"}
          />
          <NavLink
            href="/technician/jobs"
            label="Active Jobs"
            active={pathname.startsWith("/technician/jobs")}
            gold
          />
          <NavLink
            href="/technician/schedule"
            label="Schedule"
            active={pathname.startsWith("/schedule")}
          />
          <NavLink
            href="/earnings"
            label="Earnings"
            active={pathname.startsWith("/earnings")}
          />
          <NavLink
            href="/dashboard"
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
        </>
      );
    }

    if (role === "COORDINATOR" || role === "ADMIN") {
      return (
        <>
          <NavLink
            href="/coordinator"
            label="Home"
            active={pathname === "/coordinator"}
          />
          <NavLink
            href="/about"
            label="About Us"
            active={pathname === "/about"}
          />
          <NavLink
            href="/dashboard"
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
        </>
      );
    }

    return (
      <>
        <NavLink href="/" label="Home" active={pathname === "/"} />
        <NavLink
          href="/about"
          label="About Us"
          active={pathname === "/about"}
        />
      </>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-[#0A0B10]/40 border-b border-[rgba(255,255,255,0.06)] backdrop-blur-md shadow-lg shadow-black/20"
        : "bg-transparent border-b border-transparent"
        } px-4 sm:px-8 py-3.5`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* ================= LEFT: BRAND LOGO ================= */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <Image
              src="/logo2.png"
              alt="FixNest Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* ================= CENTER: NAVIGATION LABELS ================= */}
        <div className="hidden md:flex items-center gap-8">
          {isLoggedIn ? (
            renderNavLinks()
          ) : (
            <>
              <NavLink href="/" label="Home" active={pathname === "/"} />
              <NavLink
                href="/about"
                label="About Us"
                active={pathname === "/about"}
              />
            </>
          )}
        </div>

        {/* ================= RIGHT: AUTH STATE & PROFILE ================= */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {isLoggedIn ? (
            <>
              {/* Pending Status Pill for Technicians */}
              {role === "TECHNICIAN_PENDING" && (
                <Link href="/onboarding/technician" className="hidden sm:flex">
                  <PendingStatusPill />
                </Link>
              )}

              {/* Notification Bell */}
              <button
                id="navbar-notifications"
                aria-label="Notifications"
                className="relative text-[#9CA0AE] hover:text-[#ECEDF0] p-2 rounded-xl bg-[#14161E]/40 hover:bg-[#14161E] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 focus:outline-none hidden sm:flex"
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
                    strokeWidth={1.8}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#C8A55E] rounded-full" />
              </button>

              {/* User Avatar Button & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="navbar-profile-toggle"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#14161E]/70 border border-transparent hover:border-[rgba(255,255,255,0.07)] transition-all duration-200 focus:outline-none"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
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

                {/* Glassmorphic Profile Card Dropdown */}
                {dropdownOpen && (
                  <div
                    id="navbar-profile-dropdown"
                    className="absolute right-0 mt-3 w-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-[rgba(255,255,255,0.09)]"
                    style={{
                      background: "rgba(20,22,30,0.96)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    {/* Header with Centered Avatar */}
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

                    {/* Detailed User Information List */}
                    <div className="px-5 py-4 space-y-3.5 border-b border-[rgba(255,255,255,0.06)]">
                      <InfoRow
                        label="Full Name"
                        value={user?.name || "Not set"}
                      />
                      <InfoRow
                        label="Email Address"
                        value={user?.email || "—"}
                      />
                      <InfoRow
                        label="Phone Number"
                        value={user?.phone || user?.phoneNumber || "Not set"}
                      />
                      {user?.address?.city && (
                        <InfoRow
                          label="Location"
                          value={`${user.address.city}${user.address.postalCode
                            ? ` — ${user.address.postalCode}`
                            : ""
                            }`}
                        />
                      )}
                    </div>

                    {/* Actions: Edit Profile & Logout */}
                    <div className="p-3 space-y-1.5">
                      <Link
                        href="/profile"
                        id="navbar-edit-profile"
                        onClick={() => setDropdownOpen(false)}
                        className="relative group overflow-hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold font-inter text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] rounded-xl hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all duration-200 active:scale-[0.98]"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 ease-out" />
                        <svg
                          className="relative z-10 w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="relative z-10">Edit Profile</span>
                      </Link>
                      <button
                        id="navbar-logout"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium font-inter text-[#9CA0AE] hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-500/10"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest State */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                id="navbar-login"
                className="text-sm font-medium font-inter text-[#9CA0AE] hover:text-[#ECEDF0] px-4 py-2 rounded-xl transition-colors hover:bg-[#14161E]/50 border border-transparent hover:border-[rgba(255,255,255,0.06)]"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                id="navbar-signup"
                className="relative group overflow-hidden text-sm font-semibold font-inter text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <span className="relative z-10">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}