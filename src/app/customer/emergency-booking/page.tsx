"use client";


import EmergencyForm from "@/app/customer/emergency-booking/emergency-form";
import EmergencyBackground from "@/app/customer/emergency-booking/emergency-background";
import Footer from "@/components/footer";

export default function EmergencyBookingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090D] text-[#ECEDF0]">
     <section className="max-w-5xl mx-auto text-center pt-10 pb-1 mt-10">

  <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400">
    🚨 Priority Emergency Support
  </span>

  <h1 className="mt-6 text-5xl font-extrabold text-[#ECEDF0]">
    Emergency Service Request
  </h1>



</section>

      {/* Animated Background */}
      <EmergencyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-1">

      

        {/* Form */}
        <EmergencyForm />

        

      </div>

      <Footer />

    </main>
  );
}