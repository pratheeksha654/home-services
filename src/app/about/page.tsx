import Intro from "@/components/about/Intro";
import Story from "@/components/about/Story";
import WhyChoose from "@/components/about/WhyChoose";
import Promise from "@/components/about/Promise";

export default function AboutPage() {
  return (
    <main className="bg-[#08090D] text-white overflow-hidden">

      <Intro />

      <Story />

      <WhyChoose />

      <Promise />

    </main>
  );
}