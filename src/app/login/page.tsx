import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import BrandLogo from "@/components/ui/BrandLogo";

export const metadata: Metadata = {
  title: "Log In - FixNest | Book Trusted Home Services",
  description:
    "Log in to your HomeFixPro account to book and manage trusted home repair and field services.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#050505]">
      {/* ── Full Screen Photographic Background ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Home services professional background"
          fill
          className="object-cover object-center opacity-[0.55]"
          priority
        />
        {/* Dark gradient overlay so text and glass stand out perfectly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/70 to-[#050505]/30" />
      </div>

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex w-full max-w-[1440px] mx-auto flex-col lg:flex-row min-h-screen">

        {/* ── Left Side: Intro Text ── */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 lg:w-1/2">
          <div className="mb-12 animate-fade-in-up">
            <BrandLogo size="lg" variant="gold" />
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-[56px] font-heading font-bold leading-[1.15] tracking-tight text-white mb-6 animate-fade-in-up-delay-1">
            Your Home Deserves
            <br />
            <span className="bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] bg-clip-text text-transparent">
              Expert Care
            </span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md animate-fade-in-up-delay-2">
            Connect with verified professionals for plumbing, electrical, cleaning, and home repairs - all in one seamless experience.
          </p>
        </div>

        {/* ── Right Side: Auth Form ── */}
        <div className="flex flex-col justify-center items-center lg:items-end px-8 sm:px-12 lg:px-20 py-12 lg:w-1/2 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
