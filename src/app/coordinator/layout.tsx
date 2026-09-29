"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CoordinatorProtection>{children}</CoordinatorProtection>
    </AuthGuard>
  );
}

function CoordinatorProtection({ children }: { children: React.ReactNode }) {
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

    if (pathname.startsWith("/coordinator") && roleUpper !== "COORDINATOR") {
      if (roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/customer");
      }
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
  if (!user || roleUpper !== "COORDINATOR") {
    return null;
  }

  return <>{children}</>;
}
