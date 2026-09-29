import Intro from "@/components/about/intro";
import Story from "@/components/about/story";
import WhyChoose from "@/components/about/why-choose";
import Promise from "@/components/about/promise";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="bg-[#08090D] text-white overflow-hidden">

      <Intro />

      <Story />

      <WhyChoose />

      <Promise />

      <Footer />

    </main>
  );
}