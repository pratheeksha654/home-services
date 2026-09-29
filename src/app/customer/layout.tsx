"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CustomerProtection>{children}</CustomerProtection>
    </AuthGuard>
  );
}

function CustomerProtection({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Hard barrier: wait until DB role resolves

    if (!user) {
      router.replace("/login");
      return;
    }

    const roleUpper = user.role?.toUpperCase().trim();

    if (pathname.startsWith("/customer") && (roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN")) {
      router.replace("/admin/dashboard");
      return;
    }

    if (pathname.startsWith("/customer") && roleUpper === "COORDINATOR") {
      router.replace("/coordinator/dashboard");
      return;
    }

    const isTechnician = roleUpper?.startsWith("TECHNICIAN") || roleUpper === "REJECTED";
    if (pathname.startsWith("/customer") && isTechnician) {
      router.replace(getRoleBasedRoute(user.role, user.onboardingCompleted));
      return;
    }

    if (roleUpper === "CUSTOMER" && user.onboardingCompleted === false) {
      router.replace("/onboarding/details");
      return;
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0F17] flex items-center justify-center text-white font-medium">
        Authenticating...
      </div>
    );
  }

  const roleUpper = user?.role?.toUpperCase().trim();
  if (!user || roleUpper !== "CUSTOMER") {
    return null;
  }

  return <>{children}</>;
}
