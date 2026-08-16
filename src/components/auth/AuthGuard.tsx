"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (use on login/signup pages) */
  guestOnly?: boolean;
}

const ONBOARDING_ROUTES = [
  "/onboarding/details",
  "/onboarding/role-select",
  "technician/apply",
];

export default function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly && user) {
      // Authenticated user on a guest-only page (like /login)
      const targetRoute = getRoleBasedRoute(user.role, user.onboardingCompleted);
      router.replace(targetRoute);
      return;
    }

    if (!guestOnly && !user) {
      // Unauthenticated user on a protected page → redirect to /login
      router.replace("/login");
      return;
    }

    if (!guestOnly && user) {
      const roleUpper = user.role?.toUpperCase().trim();
      const isAdmin = roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN";
      const isCoordinator = roleUpper === "COORDINATOR";

      // If Admin or Coordinator is on a Customer route or Onboarding route, redirect them to their home dashboard
      if (isAdmin && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
        router.replace("/admin/dashboard");
        return;
      }
      if (isCoordinator && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
        router.replace("/coordinator/dashboard");
        return;
      }

      const isTechnician = roleUpper?.startsWith("TECHNICIAN") || roleUpper === "REJECTED";
      if (isTechnician && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
        router.replace(getRoleBasedRoute(user.role, user.onboardingCompleted));
        return;
      }

      // Customer onboarding funnel enforcement
      if (roleUpper === "CUSTOMER" || !roleUpper) {
        const isOnboardingPage = ONBOARDING_ROUTES.some((r) => pathname === r || pathname.startsWith(r));
        if (user.onboardingCompleted === false && !isOnboardingPage) {
          router.replace("/onboarding/details");
          return;
        }
      }
    }
  }, [user, isLoading, guestOnly, router, pathname]);

  // Show a loading shimmer while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0B10]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-[#C8A55E] border-t-transparent animate-spin" />
          <p className="text-sm text-[#5C6070] tracking-wide font-inter">Loading…</p>
        </div>
      </div>
    );
  }

  // Don't render children while redirecting
  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;

  if (user) {
    const roleUpper = user.role?.toUpperCase().trim();
    const isAdmin = roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN";
    const isCoordinator = roleUpper === "COORDINATOR";
    const isTechnician = roleUpper?.startsWith("TECHNICIAN") || roleUpper === "REJECTED";
    if (isAdmin && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
      return null;
    }
    if (isCoordinator && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
      return null;
    }
    if (isTechnician && (pathname.startsWith("/customer") || pathname.startsWith("/onboarding"))) {
      return null;
    }
  }

  return <>{children}</>;
}
