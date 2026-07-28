"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import Divider from "@/components/ui/Divider";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
} from "@/components/icons/Icons";

export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] mx-auto lg:mx-0">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        {/* Mobile-only logo */}
        <div className="lg:hidden animate-fade-in-up">
          <BrandLogo size="md" variant="gold" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-[28px] font-heading font-bold tracking-tight text-text-primary animate-fade-in-up">
            Welcome Back
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed animate-fade-in-up-delay-1">
            Log in to manage your home services.
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
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          icon={<LockIcon />}
          rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* ── Remember Me + Forgot Password ─────────────────────── */}
      <div className="flex items-center justify-between mt-4 animate-fade-in-up-delay-2">
        <label
          htmlFor="remember-me"
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <input
            id="remember-me"
            type="checkbox"
            className="
              peer sr-only
            "
          />
          <span
            className="
              flex h-[18px] w-[18px] items-center justify-center rounded-md
              border border-border bg-surface
              transition-all duration-300
              group-hover:border-border-hover
              peer-checked:border-gold peer-checked:bg-gold/10
              peer-focus-visible:ring-2 peer-focus-visible:ring-gold/30
            "
          >
            <svg
              className="h-3 w-3 text-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 6.5L5 9l4.5-6" />
            </svg>
          </span>
          <span className="text-xs text-text-secondary select-none">
            Remember me
          </span>
        </label>

        <a
          href="#"
          id="forgot-password-link"
          className="text-xs font-semibold text-gold hover:text-gold-light transition-colors duration-300 underline underline-offset-4 decoration-gold/25 hover:decoration-gold-light/40"
        >
          Forgot password?
        </a>
      </div>

      {/* ── Log In Button ─────────────────────────────────────── */}
      <div className="mt-6 animate-fade-in-up-delay-3">
        <GlassButton
          id="login-button"
          variant="primary"
          fullWidth
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </GlassButton>
      </div>

      {/* ── Divider + Google ──────────────────────────────────── */}
      <div className="mt-4 space-y-3 animate-fade-in-up-delay-4">
        <Divider text="or continue with" />

        <GlassButton
          id="google-login"
          variant="secondary"
          fullWidth
          onClick={() => {}}
        >
          <GoogleIcon size={18} />
          <span>Continue with Google</span>
        </GlassButton>
      </div>

      {/* ── Footer Link ───────────────────────────────────────── */}
      <p className="text-center text-sm text-text-secondary mt-6 animate-fade-in-up-delay-5">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          id="signup-link"
          className="font-semibold text-gold hover:text-gold-light transition-colors duration-300 underline underline-offset-4 decoration-gold/25 hover:decoration-gold-light/40"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
