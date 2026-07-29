"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

/* ── Step Indicator ─────────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-outfit transition-all duration-300
            ${i + 1 === current ? "bg-gradient-to-br from-[#C8A55E] to-[#A08844] text-[#08090D] shadow-lg shadow-[#C8A55E]/30"
              : i + 1 < current ? "bg-[#C8A55E]/20 text-[#C8A55E] border border-[#C8A55E]/40"
                : "bg-[#14161E] text-[#5C6070] border border-[rgba(255,255,255,0.06)]"}`}>
            {i + 1 < current
              ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-px transition-all duration-500 ${i + 1 < current ? "bg-gradient-to-r from-[#C8A55E]/60 to-[#C8A55E]/20" : "bg-[rgba(255,255,255,0.06)]"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Field Label ────────────────────────────────────────────────── */
function FieldLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#9CA0AE] font-inter">
        {label}{required && <span className="text-[#C8A55E] ml-1">*</span>}
      </label>
      {hint && <p className="text-[11px] text-[#5C6070] font-inter mt-0.5">{hint}</p>}
    </div>
  );
}

/* ── Input styles ───────────────────────────────────────────────── */
const inputCls = `
w-full
h-12
bg-[#0B0D12]
border
border-white/10
rounded-xl
px-4
text-sm
text-[#ECEDF0]
font-inter
placeholder:text-[#555A68]
transition-all
duration-200

focus:outline-none
focus:border-[#C8A55E]
focus:ring-4
focus:ring-[#C8A55E]/10

hover:border-white/20
`;
const inputErr = "border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10";

/* ── Gender Option Tile ─────────────────────────────────────────── */
function GenderTile({ value, label, icon, selected, onSelect }: {
  value: string; label: string; icon: React.ReactNode; selected: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-center gap-1.5 py-3.5 px-3 rounded-xl border transition-all duration-200 focus:outline-none group overflow-hidden
        ${selected
          ? "border-[#C8A55E] bg-[#C8A55E]/10 shadow-lg shadow-[#C8A55E]/10"
          : "border-[rgba(255,255,255,0.07)] bg-[#0D0F14] hover:border-[rgba(255,255,255,0.14)] hover:bg-[#14161E]/60"}`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C8A55E] flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-[#08090D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <span className={`text-lg transition-all duration-200 ${selected ? "scale-110" : "group-hover:scale-105"}`}>{icon}</span>
      <span className={`text-xs font-semibold font-inter transition-colors text-center ${selected ? "text-[#C8A55E]" : "text-[#9CA0AE] group-hover:text-[#ECEDF0]"}`}>
        {label}
      </span>
    </button>
  );
}

/* ── Page Content ───────────────────────────────────────────────── */
function DetailsFormContent() {
  const { user, setUserProfile } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "", street: "", city: "", postalCode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        age: user.ageCategory || "",
        gender: user.gender || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || "",
      }));
    }
  }, [user]);

  const set = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1) e.age = "Please enter a valid age.";
    if (!form.gender) e.gender = "Please select a gender.";
    if (!form.street.trim()) e.street = "Street address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setUserProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      age: form.age.trim(),
      gender: form.gender,
      address: { street: form.street.trim(), city: form.city.trim(), postalCode: form.postalCode.trim() },
    });
    await new Promise(r => setTimeout(r, 350));
    router.push("/onboarding/role-select");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-[#08090D]">

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle,#C8A55E 0%,transparent 65%)"
        }}
      />

      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">

        {/* Brand */}
        <a href="/" className="inline-flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A55E] to-[#A08844] flex items-center justify-center font-bold text-lg text-[#08090D] font-outfit shadow-lg shadow-[#C8A55E]/20 group-hover:scale-105 transition-transform">F</div>
          <span className="font-outfit font-bold text-xl text-[#ECEDF0] group-hover:text-[#E4D5A8] transition-colors">Field<span className="text-[#C8A55E]">Flow</span></span>
        </a>

        <StepIndicator current={1} total={2} />

        {/* Main Card */}
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-2xl shadow-black/60"
          style={{ background: "rgba(13,15,20,0.85)", backdropFilter: "blur(24px)" }}>

          {/* Gold top-line accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C8A55E]/60 to-transparent" />

          <div className="p-6 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold font-inter uppercase tracking-widest text-[#C8A55E] border border-[#C8A55E]/25 bg-[#C8A55E]/8 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A55E] animate-pulse" />
                Step 1 of 2 — Basic Details
              </div>
              <h1 className="text-[26px] font-outfit font-bold text-[#ECEDF0] leading-tight tracking-tight">
                Let&apos;s get to know you
              </h1>
              <p className="mt-2 text-sm text-[#9CA0AE] font-inter leading-relaxed max-w-lg">
                Complete your profile to personalise your FieldFlow experience. Takes less than 2 minutes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              {/* 1. Full Name (Full Width for clarity) */}
              <div>
                <FieldLabel label="Full Name" required />
                <input id="ob-name" type="text" autoComplete="name" placeholder="Jane Doe"
                  className={`${inputCls} ${errors.name ? inputErr : ""}`}
                  value={form.name} onChange={e => set("name", e.target.value)} />
                {errors.name && <p className="mt-1.5 text-xs text-rose-400 font-inter">{errors.name}</p>}
              </div>

              {/* 2. Email Address (Full Width Read-Only) */}
              <div>
                <FieldLabel label="Email Address" hint="Cannot be changed after registration" />
                <div className="relative">
                  <input id="ob-email" type="email" readOnly tabIndex={-1}
                    className="w-full h-12 bg-[#08090D] border border-[rgba(255,255,255,0.04)] rounded-xl px-4 text-sm text-[#5C6070] font-inter cursor-not-allowed"
                    value={user?.email || ""} />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3E4252]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3. Phone Number + Age (Spacious 2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel label="Phone Number" />
                  <input id="ob-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210"
                    className={inputCls}
                    value={form.phone} onChange={e => set("phone", e.target.value)} />
                </div>

                <div>
                  <FieldLabel label="Age" required />
                  <input id="ob-age" type="number" min="1" max="120" placeholder="e.g. 25"
                    className={`${inputCls} ${errors.age ? inputErr : ""}`}
                    value={form.age} onChange={e => set("age", e.target.value)} />
                  {errors.age && <p className="mt-1.5 text-xs text-rose-400 font-inter">{errors.age}</p>}
                </div>
              </div>

              {/* 4. Gender Tiles Section */}
              <div>
                <FieldLabel label="Gender" required />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  {[
                    { value: "Male", label: "Male", icon: "♂" },
                    { value: "Female", label: "Female", icon: "♀" },
                    { value: "Other", label: "Other", icon: "✦" },
                  ].map(opt => (
                    <GenderTile key={opt.value} {...opt}
                      selected={form.gender === opt.value}
                      onSelect={() => { set("gender", opt.value); }} />
                  ))}
                </div>
                {errors.gender && <p className="mt-2 text-xs text-rose-400 font-inter">{errors.gender}</p>}
              </div>

              {/* Section Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3E4252] font-inter">Address Details</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
              </div>

              {/* 5. Street Address */}
              <div>
                <FieldLabel label="Street Address" required />
                <input id="ob-street" type="text" autoComplete="street-address" placeholder="123 Main Street, Apt 4B"
                  className={`${inputCls} ${errors.street ? inputErr : ""}`}
                  value={form.street} onChange={e => set("street", e.target.value)} />
                {errors.street && <p className="mt-1.5 text-xs text-rose-400 font-inter">{errors.street}</p>}
              </div>

              {/* 6. City + Postal Code (Spacious 2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel label="City" required />
                  <input id="ob-city" type="text" autoComplete="address-level2" placeholder="Mumbai"
                    className={`${inputCls} ${errors.city ? inputErr : ""}`}
                    value={form.city} onChange={e => set("city", e.target.value)} />
                  {errors.city && <p className="mt-1.5 text-xs text-rose-400 font-inter">{errors.city}</p>}
                </div>
                <div>
                  <FieldLabel label="Postal Code" required />
                  <input id="ob-postal" type="text" autoComplete="postal-code" placeholder="400001"
                    className={`${inputCls} ${errors.postalCode ? inputErr : ""}`}
                    value={form.postalCode} onChange={e => set("postalCode", e.target.value)} />
                  {errors.postalCode && <p className="mt-1.5 text-xs text-rose-400 font-inter">{errors.postalCode}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button id="ob-submit" type="submit" disabled={submitting}
                  className="relative group w-full overflow-hidden flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold font-inter text-sm shadow-lg shadow-[#C8A55E]/25 hover:shadow-xl hover:shadow-[#C8A55E]/35 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="relative z-10">Saving…</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Continue to Role Selection</span>
                      <svg className="relative z-10 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#3E4252] font-inter">
          🔒 Your information is stored locally and never shared with third parties.
        </p>
      </div>
    </div>
  );
}

export default function OnboardingDetailsPage() {
  return <AuthGuard><DetailsFormContent /></AuthGuard>;
}