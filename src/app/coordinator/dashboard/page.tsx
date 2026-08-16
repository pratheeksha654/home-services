import DashboardHero from "./DashboardHero";
import SummaryCards from "./SummaryCards";
import TechnicianOverview from "./TechnicianOverview";
import QuickActions from "./QuickActions";
import ElderlyBookingsCard from "./ElderlyBookingsCard";
import Footer from "@/components/Footer";

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
