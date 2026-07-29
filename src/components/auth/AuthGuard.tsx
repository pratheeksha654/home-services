"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (use on login/signup pages) */
  guestOnly?: boolean;
}

const ONBOARDING_ROUTES = [
  "/onboarding/details",
  "/onboarding/role-select",
  "/onboarding/technician",
];

export default function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly && user) {
      // Authenticated user on a guest-only page → go to dashboard or onboarding
      if (!user.onboardingCompleted) {
        router.replace("/onboarding/details");
      } else {
        router.replace("/dashboard");
      }
    } else if (!guestOnly && !user) {
      // Unauthenticated user on a protected page → go to login
      router.replace("/login");
    } else if (!guestOnly && user) {
      // Authenticated user — enforce onboarding funnel
      const isOnboardingPage = ONBOARDING_ROUTES.some((r) => pathname === r || pathname.startsWith(r));

      if (!user.onboardingCompleted && !isOnboardingPage) {
        // Not yet onboarded and not already on an onboarding page → redirect
        router.replace("/onboarding/details");
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

  return <>{children}</>;
}
