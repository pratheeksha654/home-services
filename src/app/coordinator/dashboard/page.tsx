import DashboardHero from "./dashboard-hero";
import SummaryCards from "./summary-cards";
import TechnicianOverview from "./technician-overview";
import QuickActions from "./quick-actions";
import ElderlyBookingsCard from "./elderly-bookings-card";
import Footer from "@/components/footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08090D] p-8 space-y-8">
      <DashboardHero />
      <QuickActions />
      <SummaryCards />
      <ElderlyBookingsCard />
      <TechnicianOverview />
      <Footer />
    </main>
  );
}
