"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole, getRoleBasedRoute } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";

/* ── Step Indicator ─────────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-outfit transition-all duration-300 ${i + 1 === current
              ? "bg-gradient-to-br from-[#C8A55E] to-[#A08844] text-[#08090D] shadow-lg shadow-[#C8A55E]/30"
              : i + 1 < current
                ? "bg-[#C8A55E]/20 text-[#C8A55E] border border-[#C8A55E]/40"
                : "bg-[#14161E] text-[#5C6070] border border-[rgba(255,255,255,0.06)]"
              }`}
          >
            {i + 1 < current ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-px transition-all duration-500 ${i + 1 < current
                ? "bg-gradient-to-r from-[#C8A55E]/60 to-[#C8A55E]/20"
                : "bg-[rgba(255,255,255,0.06)]"
                }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Feature Bullet ─────────────────────────────────────────────── */
function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-[#9CA0AE] font-inter">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <svg className="w-2.5 h-2.5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span>{text}</span>
    </li>
  );
}

/* ── Role Card ──────────────────────────────────────────────────── */
function RoleCard({
  id,
  title,
  subtitle,
  bullets,
  badge,
  accentColor,
  glowColor,
  icon,
  isSelected,
  isLoading,
  onClick,
}: {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  badge?: string;
  accentColor: string;
  glowColor: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="relative group w-full text-left rounded-2xl border transition-all duration-300 focus:outline-none overflow-hidden disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
      style={{
        borderColor: isSelected ? `${accentColor}80` : "rgba(255,255,255,0.07)",
        background: isSelected
          ? `linear-gradient(135deg, ${accentColor}0D, #14161E 60%)`
          : "#0D0F14CC",
        boxShadow: isSelected
          ? `0 0 40px -10px ${glowColor}, 0 20px 60px -15px rgba(0,0,0,0.6)`
          : "0 10px 40px -15px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: isSelected ? 1 : 0,
        }}
      />

      {/* Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}0A, transparent 65%)`,
        }}
      />

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon Badge */}
          <div
            className="w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}0D)`,
              border: `1px solid ${accentColor}40`,
            }}
          >
            <div style={{ color: accentColor }}>{icon}</div>
          </div>

          {/* Title & Subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h3 className="text-base sm:text-lg font-outfit font-bold text-[#ECEDF0] group-hover:text-white transition-colors leading-tight">
                {title}
              </h3>
              {badge && (
                <span
                  className="text-[10px] font-semibold font-inter uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    color: accentColor,
                    background: `${accentColor}18`,
                    border: `1px solid ${accentColor}35`,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#9CA0AE] font-inter leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Selection Radio / Arrow */}
          <div className="flex-shrink-0 mt-0.5">
            {isSelected ? (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}DD)` }}
              >
                <svg className="w-3.5 h-3.5 text-[#08090D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-white/10 bg-[#0D0F14] group-hover:border-white/20 flex items-center justify-center text-[#3E4252] group-hover:text-[#9CA0AE] transition-all duration-200">
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Feature Bullets */}
        <ul className="mt-5 space-y-2 pl-0">
          {bullets.map((bulletText, i) => (
            <Bullet key={i} text={bulletText} color={accentColor} />
          ))}
        </ul>
      </div>
    </button>
  );
}

/* ── Inner Content Component ────────────────────────────────────── */
function RoleSelectContent() {
  const { user, isLoading, setRole, completeOnboarding } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<"CUSTOMER" | "TECHNICIAN_PENDING" | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect already-registered users to their role-based home page
  useEffect(() => {
    if (!isLoading && user?.onboardingCompleted) {
      router.replace(getRoleBasedRoute(user.role));
    }
  }, [isLoading, user, router]);

  const handleSelect = async (role: "CUSTOMER" | "TECHNICIAN_PENDING") => {
    if (loading) return;
    setSelected(role);
    setLoading(true);

    try {
      // 1. Set the role in AuthContext & LocalStorage
      await setRole(role as UserRole);

      if (role === "CUSTOMER") {
        // 2. Complete onboarding and await promise/state updates
        await completeOnboarding();

        // 3. Force-write flag to local storage so AuthGuard sees it synchronously
        if (typeof window !== "undefined") {
          localStorage.setItem("onboardingCompleted", "true");
        }

        // 4. Navigate to dashboard using replace to clear history stack
        router.replace("/customer");
      } else {
        router.push("/technician/apply");
      }
    } catch (error) {
      console.error("Error during selection:", error);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ background: "linear-gradient(175deg, #14161E 0%, #0A0B10 45%, #08090D 100%)" }}
    >
      {/* Background Glows */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-[0.035]"
        style={{ background: "radial-gradient(circle, #C8A55E 0%, transparent 65%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-xl animate-fade-in-up">
        {/* Header / Brand */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8A55E] to-[#A08844] flex items-center justify-center font-bold text-base text-[#08090D] font-outfit shadow-md shadow-[#C8A55E]/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-outfit font-bold text-xl text-[#ECEDF0] group-hover:text-[#E4D5A8] transition-colors">
              Field<span className="text-[#C8A55E]">Flow</span>
            </span>
          </a>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold font-inter uppercase tracking-widest text-[#C8A55E] border border-[#C8A55E]/25 bg-[#C8A55E]/8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A55E] animate-pulse" />
            Step 2 of 2
          </div>
        </div>

        <StepIndicator current={2} total={2} />

        {/* Title Section */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-[#ECEDF0] leading-tight tracking-tight">
            How will you use <span className="text-[#C8A55E]">FieldFlow</span>?
          </h1>
          <p className="mt-2 text-sm text-[#9CA0AE] font-inter leading-relaxed">
            Select the role that best describes you. Your experience will be tailored to your choice.
          </p>
        </div>

        {/* Role Cards Stack */}
        <div className="space-y-4">
          <RoleCard
            id="role-customer"
            title="Continue as Customer"
            subtitle="Book trusted field services and manage bookings easily."
            bullets={[
              "Book verified service experts in minutes",
              "Track real-time updates and technician arrival",
              "Manage payments and service history",
            ]}
            badge="Popular"
            accentColor="#C8A55E"
            glowColor="rgba(200,165,94,0.18)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            isSelected={selected === "CUSTOMER"}
            isLoading={loading}
            onClick={() => handleSelect("CUSTOMER")}
          />

          <RoleCard
            id="role-technician"
            title="Apply as Technician"
            subtitle="Join our network of professionals and offer field skills."
            bullets={[
              "Accept service jobs tailored to your skills",
              "Manage flexible hours and work schedule",
              "Track ratings, reviews, and income history",
            ]}
            accentColor="#818CF8"
            glowColor="rgba(129,140,248,0.18)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            isSelected={selected === "TECHNICIAN_PENDING"}
            isLoading={loading}
            onClick={() => handleSelect("TECHNICIAN_PENDING")}
          />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2.5 text-sm text-[#C8A55E] font-inter animate-fade-in-up">
            <svg className="w-4 h-4 animate-spin text-[#C8A55E]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>
              {selected === "CUSTOMER" ? "Setting up dashboard…" : "Redirecting to technician setup…"}
            </span>
          </div>
        )}

        {/* Footer Note */}
        <p className="mt-8 text-center text-xs text-[#3E4252] font-inter">
          🔒 Coordinator and Admin accounts require internal authorization.
        </p>
      </div>
    </div>
  );
}

export default function OnboardingRoleSelectPage() {
  return (
    <AuthGuard>
      <RoleSelectContent />
    </AuthGuard>
  );
}