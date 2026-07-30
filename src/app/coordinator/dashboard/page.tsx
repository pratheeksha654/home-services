import DashboardHero from "./DashboardHero";
import SummaryCards from "./SummaryCards";
import TechnicianOverview from "./TechnicianOverview";
import QuickActions from "./QuickActions";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08090D] p-8">

      <DashboardHero />
      <QuickActions />

      <SummaryCards />
        <TechnicianOverview />
        <Footer/>

   

      

    </main>
  );
}