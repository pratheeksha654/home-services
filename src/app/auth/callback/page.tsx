"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const errorDesc = params.get("error_description") || params.get("error");
        if (errorDesc) {
          setError(decodeURIComponent(errorDesc));
          return;
        }

        const accessToken = params.get("access_token");
        if (!accessToken) {
          setError("No access token found in URL");
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to fetch user profile");
          return;
        }

        const sessionUser = data.data.user;
        setSession(sessionUser, accessToken);

        const isSpecialRole = sessionUser.role === "COORDINATOR" || sessionUser.role === "ADMIN";
        if (!sessionUser.onboardingCompleted && !isSpecialRole) {
          router.push("/onboarding/details");
        } else {
          router.push(getRoleBasedRoute(sessionUser.role));
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("An unexpected error occurred during login.");
      }
    };

    handleCallback();
  }, [router, setSession]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4">
        <div className="bg-surface border border-border p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian rounded-xl font-semibold hover:scale-[1.02] transition-transform"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
      <p className="text-gold font-medium animate-pulse">Completing sign in...</p>
    </div>
  );
}
