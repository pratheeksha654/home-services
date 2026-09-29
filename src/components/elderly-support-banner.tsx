"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function ElderlySupportBanner() {
  const router = useRouter();
  const { user } = useAuth();
  const [isElderly, setIsElderly] = useState(false);

  useEffect(() => {
    // Re-evaluate user data whenever the auth state or user object changes
    if (user) {
      const ageNum = user.age !== undefined ? Number(user.age) : 0;
      const ageCategoryLower = (user.ageCategory || "").toLowerCase();
      const isSenior = ageNum >= 60 || (user as any).isElderly === true || ageCategoryLower === "senior" || ageCategoryLower === "elderly";
      const isCustomer = !user.role || user.role.toUpperCase() === "CUSTOMER";
      setIsElderly(isCustomer && isSenior);
    } else {
      setIsElderly(false);
    }
  }, [user]);

  if (!isElderly) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#14161E] via-[#1A1D28] to-[#14161E] border-b border-[rgba(200,165,94,0.2)]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-[#C8A55E]/10 blur-[100px]" />
      <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-[#818CF8]/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8A55E]/10 border border-[#C8A55E]/20">
              <Phone className="h-6 w-6 text-[#C8A55E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#ECEDF0] font-outfit">
                Need Assistance Booking?
              </h2>
              <p className="text-sm text-[#9CA0AE]">
                Our senior care coordinators are here to help you schedule services over the phone.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] px-6 py-3 text-sm font-bold text-[#08090D] shadow-lg shadow-[#C8A55E]/20 hover:shadow-xl hover:shadow-[#C8A55E]/30 transition-all active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" />
              Call Coordinator to Book
            </a>
            <Button
              variant="outline"
              onClick={() => router.push("/customer/book")}
              className="border-[rgba(255,255,255,0.1)] hover:border-[#C8A55E]/50 text-[#ECEDF0] hover:text-[#C8A55E]"
            >
              Book Online Yourself
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
