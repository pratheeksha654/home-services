"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminProtection>{children}</AdminProtection>
    </AuthGuard>
  );
}

function AdminProtection({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace(getRoleBasedRoute(user.role));
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-text-secondary tracking-wide">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {children}
      </div>
    </div>
  );
}
