"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import Divider from "@/components/ui/Divider";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
} from "@/components/icons/Icons";

export default function SignUpForm() {
  const { signup, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signup({ name, email, phone, password, confirmPassword });
    if (!result.success) {
      setError(result.error || "Signup failed.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] mx-auto lg:mx-0">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        {/* Mobile-only logo (hidden on desktop where HeroPanel shows it) */}
        <div className="lg:hidden animate-fade-in-up">
          <BrandLogo size="md" variant="gold" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-[28px] font-heading font-bold tracking-tight text-text-primary animate-fade-in-up">
            Create Your Account
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed animate-fade-in-up-delay-1">
            Book trusted home services in just a few clicks.
          </p>
        </div>
      </div>

      {/* ── Error Alert ────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* ── Form Fields ───────────────────────────────────────── */}
      <div className="space-y-4 animate-fade-in-up-delay-2">
        <GlassInput
          id="full-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<UserIcon />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <GlassInput
          id="email-address"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          id="phone-number"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          icon={<PhoneIcon />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<LockIcon />}
            rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <GlassInput
            id="confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<LockIcon />}
            rightIcon={showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            onRightIconClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* ── Sign Up Button ────────────────────────────────────── */}
      <div className="mt-6 animate-fade-in-up-delay-3">
        <GlassButton
          id="sign-up-button"
          variant="primary"
          fullWidth
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create Account"}
        </GlassButton>
      </div>

      {/* ── Divider + Google ──────────────────────────────────── */}
      <div className="mt-4 space-y-3 animate-fade-in-up-delay-4">
        <Divider text="or continue with" />

        <GlassButton
          id="google-sign-up"
          variant="secondary"
          fullWidth
          onClick={async () => {
            setError("");
            const res = await loginWithGoogle();
            if (res && !res.success) {
              setError(res.error || "Failed to initiate Google sign up");
            }
          }}
        >
          <GoogleIcon size={18} />
          <span>Continue with Google</span>
        </GlassButton>
      </div>

      {/* ── Footer Link ───────────────────────────────────────── */}
      <p className="text-center text-sm text-text-secondary mt-4 animate-fade-in-up-delay-5">
        Already have an account?{" "}
        <Link
          href="/login"
          id="login-link"
          className="font-semibold text-gold hover:text-gold-light transition-colors duration-300 underline underline-offset-4 decoration-gold/25 hover:decoration-gold-light/40"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
