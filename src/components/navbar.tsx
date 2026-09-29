"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import { Phone } from "lucide-react";

import { NavLink } from "./navbar/nav-link";
import { ProfileDropdown } from "./navbar/profile-dropdown";
import { MobileMenu } from "./navbar/mobile-menu";
import { getNavLinksForRole, isNavItemActive } from "@/lib/nav-config";

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
      return "/customer/profile";
    default:
      return "/profile";
  }
}

function getNotificationRoute(role?: string | null): string {
  const normalizedRole = role ? role.toUpperCase().trim() : "CUSTOMER";

  switch (normalizedRole) {
    case "ADMIN":
      return "/admin/notifications";
    case "TECHNICIAN":
    case "TECHNICIAN_PENDING":
      return "/technician/notifications";
    case "COORDINATOR":
      return "/coordinator/notifications";
    case "CUSTOMER":
    default:
      return "/customer/notifications";
  }
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const hiddenRoutes = [
    "/login",
    "/onboarding/details",
    "/onboarding/role-select",
    "/onboarding/technician",
  ];

  const shouldHideNavbar = hiddenRoutes.some(
    (r) => pathname === r || pathname.startsWith(r)
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (shouldHideNavbar) return null;

  const isLoggedIn = Boolean(user);
  
  // Determine effective role reactively from user or current URL path fallback
  let role = user?.role ? user.role.toUpperCase().trim() : null;
  if (!role) {
    if (pathname.startsWith("/admin")) {
      role = "ADMIN";
    } else if (pathname.startsWith("/coordinator")) {
      role = "COORDINATOR";
    } else if (pathname.startsWith("/technician")) {
      role = "TECHNICIAN";
    } else if (pathname.startsWith("/customer")) {
      role = "CUSTOMER";
    }
  }

  const notificationPath = getNotificationRoute(role);
  const profilePath = getProfileRoute(role);
  const initials = user?.name
    ? user.name
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  const navItems = getNavLinksForRole(role);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-[#0A0B10]/40 border-b border-[rgba(255,255,255,0.06)] backdrop-blur-md shadow-lg shadow-black/20"
        : "bg-transparent border-b border-transparent"
        } px-4 sm:px-8 py-3.5`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link
          href={isLoggedIn && role ? getRoleBasedRoute(role) : "/login"}
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

        {/* Desktop Dynamic Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              gold={item.gold}
              active={isNavItemActive(item.href, pathname)}
            />
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Senior Support Call Button */}
          {isLoggedIn && role === "CUSTOMER" && Number(user?.age) >= 60 && (
            <a
              href="tel:+18005550199"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-semibold font-inter transition-all duration-200"
              title="Call Senior Support"
            >
              <Phone className="w-4 h-4" />
              <span>Senior Support</span>
            </a>
          )}

          <MobileMenu
            isLoggedIn={isLoggedIn}
            user={user}
            role={role}
            initials={initials}
            pathname={pathname}
            notificationPath={notificationPath}
            mobileMenuOpen={mobileMenuOpen}
            mobileMenuRef={mobileMenuRef}
            setMobileMenuOpen={setMobileMenuOpen}
            logout={logout}
            unreadCount={unreadCount}
          />

          {isLoggedIn ? (
            <>
              <Link
                href={notificationPath}
                id="navbar-notifications"
                aria-label="Notifications"
                className="relative text-[#9CA0AE] hover:text-[#ECEDF0] p-2 rounded-xl bg-[#14161E]/40 hover:bg-[#14161E] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 focus:outline-none hidden sm:flex items-center justify-center"
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
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#0A0B10]">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <ProfileDropdown
                user={user}
                role={role}
                initials={initials}
                dropdownOpen={dropdownOpen}
                dropdownRef={dropdownRef}
                setDropdownOpen={setDropdownOpen}
                logout={logout}
              />

              <button
                type="button"
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold font-inter transition-all duration-200"
              >
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="relative group overflow-hidden text-sm font-semibold font-inter text-[#08090D] bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all duration-200 active:scale-[0.98]"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}