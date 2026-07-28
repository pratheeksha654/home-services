import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import HeroPanel from "@/components/ui/HeroPanel";

export const metadata: Metadata = {
  title: "Log In – HomeFixPro | Book Trusted Home Services",
  description:
    "Log in to your HomeFixPro account to book and manage trusted home repair and field services.",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Left: Hero Panel (desktop only) ───────────────────── */}
      <HeroPanel />

      {/* ── Right: Login Form ─────────────────────────────────── */}
      <div className="relative flex flex-1 lg:w-1/2 xl:w-[45%] flex-col bg-obsidian">
        {/* Subtle ambient glow behind form */}
        <div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.03] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #C8A55E 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] rounded-full opacity-[0.02] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #818CF8 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Form container — centered vertically & horizontally */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-6">
          <LoginForm />
        </main>

        {/* Footer */}
        <footer className="relative z-10 pb-6 text-center lg:text-left lg:px-12 xl:px-16">
          <p className="text-[11px] text-text-ghost tracking-wide">
            © 2026 HomeFixPro. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
