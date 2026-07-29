import type { Metadata } from "next";
import TermsContent from "@/components/terms/TermsContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions - HomeFixPro | Trusted Home Services",
  description:
    "Read the HomeFixPro Terms and Conditions. Learn about our booking policies, refund process, user responsibilities, privacy practices, and more.",
};

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian">
      {/* Ambient glows */}
      <div
        className="absolute top-[8%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.025] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C8A55E 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[45%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.015] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #818CF8 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full opacity-[0.02] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C8A55E 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="relative z-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
          <div className="animate-fade-in-up">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-text-primary">
              Terms &{" "}
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using the HomeFixPro
              platform. By accessing or using our services, you agree to be
              bound by these terms.
            </p>
            <p className="mt-3 text-text-muted text-sm">
              Last updated: July 29, 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="relative z-10 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <TermsContent />
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
