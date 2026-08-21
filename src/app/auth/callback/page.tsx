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
        const hashParams = new URLSearchParams(hash);
        const searchParams = new URLSearchParams(window.location.search);
        
        const errorDesc = searchParams.get("error_description") || hashParams.get("error_description") || searchParams.get("error") || hashParams.get("error");
        if (errorDesc) {
          setError(decodeURIComponent(errorDesc));
          return;
        }

        const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
        const code = searchParams.get("code");

        if (!accessToken && !code) {
          setError("No access token or authorization code found in URL.");
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        let sessionUser = null;
        let token = accessToken;

        if (accessToken) {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            sessionUser = data.data.user;
          }
        } else if (code) {
          const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const data = await response.json();
          if (response.ok && data.success) {
            sessionUser = data.data.user;
            token = data.data.access_token;
          }
        }

        if (!sessionUser) {
          setError("Failed to fetch user profile from database.");
          return;
        }

        setSession(sessionUser, token || "");

        const targetRoute = getRoleBasedRoute(sessionUser.role, sessionUser.onboardingCompleted);
        router.replace(targetRoute);
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("An unexpected error occurred during authentication.");
      }
    };

    handleCallback();
  }, [router, setSession]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-4">
        <div className="bg-[#10121A] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-rose-400 mb-4">Authentication Error</h2>
          <p className="text-[#9CA0AE] mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] rounded-xl font-bold hover:scale-[1.02] transition-transform"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8A55E] mb-4"></div>
      <p className="text-[#C8A55E] font-medium animate-pulse">Completing sign in...</p>
    </div>
  );
}
