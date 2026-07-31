"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/ui/BrandLogo";
import { GoogleIcon } from "@/components/icons/Icons";
import { ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleAuth = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res && !res.success) {
        setError(res.error || "Authentication failed.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="relative rounded-3xl border border-white/10 bg-black/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col items-center text-center">

        <div className="w-full relative z-10 flex flex-col items-center">
          {/* Minimalist Heading */}
          <div className="mb-8 space-y-1.5">
            <h1 className="text-[22px] font-heading font-semibold text-white tracking-wide drop-shadow-sm">
              Access Your Account
            </h1>
            <p className="text-sm text-white/60 font-light">
              Quick and secure sign in
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="w-full mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Standard Sized Premium Google Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleAuth}
            className="w-full group overflow-hidden py-3.5 px-6 rounded-xl bg-white hover:bg-gray-50 text-gray-900 shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon size={22} className="shrink-0" />
            <span className="text-[15px] font-semibold tracking-wide font-inter">
              {isSubmitting ? "Connecting..." : "Continue with Google"}
            </span>
          </button>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 w-full flex flex-col items-center gap-2.5">

          <p className="text-[11px] text-white/30 text-center px-2 leading-relaxed">
            By continuing, you agree to FixNest's Terms of Service and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
