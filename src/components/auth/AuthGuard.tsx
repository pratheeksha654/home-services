"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (use on login/signup pages) */
  guestOnly?: boolean;
}

export default function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly && user) {
      // Authenticated user on a guest-only page → go to dashboard
      router.replace("/dashboard");
    } else if (!guestOnly && !user) {
      // Unauthenticated user on a protected page → go to login
      router.replace("/login");
    }
  }, [user, isLoading, guestOnly, router]);

  // Show a loading shimmer while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-obsidian">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-text-muted tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  // Don't render children while redirecting
  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;

  return <>{children}</>;
}
