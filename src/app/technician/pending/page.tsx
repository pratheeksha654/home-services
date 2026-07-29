// app/technician/pending/page.tsx

"use client";

import Link from "next/link";

export default function TechnicianPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0F14] px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#151922] p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#C8A55E]/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#C8A55E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2A9 9 0 1112 3a9 9 0 019 9z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white">
          Application Submitted
        </h1>

        <p className="mt-4 text-gray-400">
          Thank you for applying to become a FixNest technician.
        </p>

        <div className="mt-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5">
          <p className="text-sm uppercase tracking-wider text-yellow-400">
            Application Status
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-yellow-300">
            Pending Approval
          </h2>

          <p className="mt-3 text-gray-300">
            Your application has been successfully submitted and is
            awaiting review by our dispatcher team.
          </p>

          <p className="mt-2 text-gray-400">
            You'll be able to access the Technician Dashboard once your
            application has been approved.
          </p>
        </div>

        
      </div>
    </main>
  );
}