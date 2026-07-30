"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GlassButton from "@/components/ui/GlassButton";
import { AlertCircle, Sparkles } from "lucide-react";

export default function TechnicianRejectedPage() {
  const { user, getToken } = useAuth();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(`${API_URL}/technicians/application-status?userId=${encodeURIComponent(user.id)}`, {
          headers: {
            Authorization: `Bearer ${getToken() || ""}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setStatus(data.data?.status?.toUpperCase() || null);
        }
      } catch (error) {
        console.error("Failed to fetch application status", error);
      }
    };

    checkStatus();
  }, [getToken, user?.id]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-4 text-text-primary">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center shadow-2xl">
        <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-gold-glow blur-[140px]" />

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>

        <div className="mb-3 flex items-center justify-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-gold">
          <Sparkles size={12} />
          <span>Application Update</span>
        </div>

        <h1 className="text-3xl font-black font-heading text-text-primary">
          Application Rejected
        </h1>

        <p className="mt-4 text-sm text-text-secondary">
          {status === "REJECTED"
            ? "Your technician application was reviewed and not approved by the coordinator this time."
            : "This application status could not be verified yet."}
        </p>

        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-left">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-red-400">
            Status Note
          </span>
          <h2 className="text-xl font-bold font-heading text-red-400">
            Review Required
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            You can still contact the coordinator for feedback, update your documents, or reapply after addressing the concerns raised during the review.
          </p>
        </div>

        <div className="mt-8">
          <GlassButton variant="secondary" fullWidth onClick={() => (window.location.href = "/onboarding/role-select")}>
            Back to Home
          </GlassButton>
        </div>
      </div>
    </main>
  );
}
