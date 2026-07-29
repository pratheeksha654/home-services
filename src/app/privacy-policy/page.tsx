import Footer from "@/components/Footer";
import SecurityCard from "@/components/privacy/SecurityCard";
import PrivacyHero from "@/components/privacy/PrivacyHero";
import SectionTitle from "@/components/privacy/SectionTitle";
import InfoCard from "@/components/privacy/InfoCard";
import FeatureCard from "@/components/privacy/FeatureCard";

import {
  User,
  CalendarDays,
  Bell,
  Smartphone,
  Wrench,
  Lock,
  ShieldCheck,
  Database,
  Eye,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0D0F14] text-white">

      <PrivacyHero />

      <section className="max-w-7xl mx-auto px-6 py-20">

       

<section className="max-w-7xl mx-auto px-6 ">

  <SectionTitle
    title="Information We Collect"
    subtitle="We only collect information required to provide safe, efficient, and reliable home services."
  />

  <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

    <InfoCard
      icon={<User size={28} />}
      title="Personal"
      description="Basic account details used for identification."
      items={[
        "Full Name",
        "Email Address",
        "Phone Number",
      ]}
    />

    <InfoCard
      icon={<CalendarDays size={28} />}
      title="Bookings"
      description="Information related to service requests."
      items={[
        "Service Type",
        "Address",
        "Preferred Time",
      ]}
    />

    <InfoCard
      icon={<Wrench size={28} />}
      title="Technician"
      description="Professional information for assignments."
      items={[
        "Skills",
        "Availability",
        "Experience",
      ]}
    />

    <InfoCard
      icon={<Smartphone size={28} />}
      title="Device"
      description="Technical information that improves security."
      items={[
        "Browser",
        "IP Address",
        "Usage Data",
      ]}
    />

  </div>

</section>

<div className="mt-28">

<SectionTitle
    title="How We Use Your Information"
    subtitle="Your information helps us provide reliable, secure and efficient services."
/>

<div className="grid md:grid-cols-2 gap-8">

    <FeatureCard
        icon={<User size={30} />}
        title="Account Management"
        description="Your personal information is used to create and manage your FixNest account securely."
    />

    <FeatureCard
        icon={<CalendarDays size={30} />}
        title="Service Bookings"
        description="Booking details help us schedule services and assign the right technician."
    />

    <FeatureCard
        icon={<Bell size={30} />}
        title="Notifications"
        description="Receive booking confirmations, technician updates, reminders and alerts."
    />

    <FeatureCard
        icon={<ShieldCheck size={30} />}
        title="Security"
        description="We monitor accounts and protect your information against unauthorized access."
    />

</div>

</div>

<section className="max-w-7xl mx-auto px-6 py-20">

  <SectionTitle
    title="Privacy & Security"
    subtitle="We follow industry-standard practices to keep your personal information protected."
  />

  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

    <SecurityCard
      icon={<Lock size={30} />}
      title="Passwords"
      value="Encrypted"
    />

    <SecurityCard
      icon={<ShieldCheck size={30} />}
      title="Access"
      value="Role-Based"
    />

    <SecurityCard
      icon={<Database size={30} />}
      title="Storage"
      value="Secure"
    />

    <SecurityCard
      icon={<Eye size={30} />}
      title="Monitoring"
      value="24/7"
    />

  </div>

</section>
<div className="mt-12 rounded-3xl border border-[#C8A55E]/20 bg-gradient-to-r from-[#14161E] to-[#1A1D28] p-8">

  <h3 className="text-2xl font-bold text-white">
    Your Privacy Comes First
  </h3>

  <p className="mt-4 text-[#9CA0AE] leading-8">
    FixNest never sells your personal information. Your data is shared only
    with authorized technicians and administrators when required to complete
    your requested home service. We are committed to maintaining transparency,
    confidentiality, and trust throughout your experience.
  </p>

</div>

      </section>

      <Footer />

    </main>
  );
}