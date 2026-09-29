"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminProtection>{children}</AdminProtection>
    </AuthGuard>
  );
}

function AdminProtection({ children }: { children: React.ReactNode }) {
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

    if (pathname.startsWith("/admin") && roleUpper !== "ADMIN" && roleUpper !== "SUPER_ADMIN") {
      router.replace(roleUpper === "COORDINATOR" ? "/coordinator/dashboard" : "/customer");
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
  if (!user || (roleUpper !== "ADMIN" && roleUpper !== "SUPER_ADMIN")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {children}
      </div>
    </div>
  );
}
