import Hero from "./Hero";
import QuickActions from "./QuickActions";
import PopularServices from "./ServicesSection";
import Footer from "@/components/Footer";
import ElderlySupportBanner from "@/components/ElderlySupportBanner";

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