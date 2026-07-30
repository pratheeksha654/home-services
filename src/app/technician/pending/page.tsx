// app/technician/pending/page.tsx

"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";

export default function TechnicianPendingPage() {
  const { user } = useAuth();
  const isApproved = user?.role === "TECHNICIAN";

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-4 text-text-primary">
      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-surface p-8 text-center shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold-glow blur-[140px] pointer-events-none" />

        {isApproved ? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-gold mb-3">
              <Sparkles size={12} />
              <span>Congratulations</span>
            </div>

            <h1 className="text-3xl font-black font-heading text-text-primary">
              Application Approved!
            </h1>

            <p className="mt-4 text-text-secondary text-sm">
              Welcome to the team! Your technician application has been reviewed and approved by the coordinator.
            </p>

            <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-400 block mb-1">
                Account Status
              </span>
              <h2 className="text-xl font-bold font-heading text-green-400">
                Active Technician
              </h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                You now have full access to our technician platform. You can start receiving service request assignments and managing bookings.
              </p>
            </div>

            <div className="mt-8">
              <GlassButton variant="primary" fullWidth onClick={() => window.location.href = "/"}>
                Go to Home
              </GlassButton>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-gold mb-3">
              <span>Status Check</span>
            </div>

            <h1 className="text-3xl font-black font-heading text-text-primary">
              Application Submitted
            </h1>

            <p className="mt-4 text-text-secondary text-sm">
              Thank you for applying to become a FixNest technician.
            </p>

            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400 block mb-1">
                Application Status
              </span>
              <h2 className="text-xl font-bold font-heading text-yellow-400">
                Pending Approval
              </h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                Your application has been successfully submitted and is awaiting review by our coordinator.
              </p>
              <p className="mt-2 text-xs text-text-muted">
                You will be able to access the platform once a coordinator reviews and approves your submission.
              </p>
            </div>

            <div className="mt-8">
              <GlassButton variant="secondary" fullWidth onClick={() => window.location.href = "/"}>
                Back to Home
              </GlassButton>
            </div>
          </>
        )}
      </div>
    </main>
  );
}