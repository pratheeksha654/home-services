import Hero from "./Hero";
import QuickActions from "./QuickActions";
import PopularServices from "./ServicesSection";
import Footer from "@/components/Footer";

export default function CustomerHome() {
  return (
    <>
      <Hero />
      <QuickActions />
      <PopularServices />
      <Footer />
    </>
  );
}