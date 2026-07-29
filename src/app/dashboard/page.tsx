"use client";

import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import BrandLogo from "@/components/ui/BrandLogo";
import GlassButton from "@/components/ui/GlassButton";

function LogOutIcon() {
  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian">
      {/* Ambient glows */}
      <div
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C8A55E 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.02] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #818CF8 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-5 border-b border-border">
        <BrandLogo size="md" variant="gold" />
        <GlassButton variant="ghost" onClick={logout} id="logout-button">
          <LogOutIcon />
          <span>Log out</span>
        </GlassButton>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="text-center space-y-6 animate-fade-in-up">
          {/* Avatar Circle */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-indigo/10 border border-border-gold">
            <span className="text-3xl font-heading font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-text-primary">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
            <p className="text-text-secondary text-base max-w-md mx-auto leading-relaxed">
              Your HomeFixPro dashboard is ready. Manage your bookings, explore services, and connect with pros.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 pt-2 animate-fade-in-up-delay-2">
            <DashStat value="0" label="Bookings" />
            <div className="w-px h-10 bg-border" />
            <DashStat value="50+" label="Services" />
            <div className="w-px h-10 bg-border" />
            <DashStat value="24/7" label="Support" />
          </div>

          {/* CTA */}
          <div className="pt-4 animate-fade-in-up-delay-3">
            <GlassButton variant="primary" id="explore-services-button">
              Explore Services
            </GlassButton>
          </div>
        </div>
      </main>

     
        
    </div>
    
  );
}

function DashStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-0.5 text-center">
      <div className="text-lg font-heading font-bold text-gold-light">{value}</div>
      <div className="text-[11px] font-medium text-text-muted tracking-wide uppercase">{label}</div>
    </div>
    
  );

}
