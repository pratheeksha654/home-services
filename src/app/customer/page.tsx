import Hero from "./hero";
import QuickActions from "./quick-actions";
import PopularServices from "./services-section";
import Footer from "@/components/footer";
import ElderlySupportBanner from "@/components/elderly-support-banner";

export default function CustomerHome() {
  return (
    <>
      <ElderlySupportBanner />
      <Hero />
      <QuickActions />
      <PopularServices />
      <Footer />
    </>
  );
}