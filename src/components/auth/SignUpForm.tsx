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
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signup({
      name,
      email,
      phone,
      gender,
      street,
      city,
      postalCode,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error || "Signup failed.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[460px] mx-auto lg:mx-0">
      {/* Header */}
      <div className="space-y-4 mb-6">
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

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3 animate-fade-in-up-delay-2 max-h-[60vh] overflow-y-auto pr-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GlassInput
            id="phone-number"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            icon={<PhoneIcon />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#14161E]/80 border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
            >
              <option value="" className="bg-[#10121A]">Select Gender</option>
              <option value="Female" className="bg-[#10121A]">Female</option>
              <option value="Male" className="bg-[#10121A]">Male</option>
              <option value="Other" className="bg-[#10121A]">Other</option>
            </select>
          </div>
        </div>

        <GlassInput
          id="street-address"
          label="Street Address"
          type="text"
          placeholder="123 Main St"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GlassInput
            id="city"
            label="City"
            type="text"
            placeholder="New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <GlassInput
            id="postal-code"
            label="Postal Code"
            type="text"
            placeholder="576101"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Sign Up Button */}
      <div className="mt-5 animate-fade-in-up-delay-3">
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

      {/* Divider + Google */}
      <div className="mt-4 space-y-3 animate-fade-in-up-delay-4">
        <Divider text="or continue with" />

        <GlassButton
          id="google-sign-up"
          variant="secondary"
          fullWidth
          type="button"
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

      {/* Footer Link */}
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