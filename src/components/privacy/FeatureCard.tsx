import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14161E] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8A55E]/40 hover:shadow-[0_0_40px_rgba(200,165,94,0.15)]">

      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#C8A55E]/5 blur-3xl group-hover:bg-[#C8A55E]/10 transition duration-300"></div>

      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8A55E]/20 to-[#C8A55E]/5 border border-[#C8A55E]/20 text-[#C8A55E]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-[#ECEDF0]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 leading-7 text-[#9CA0AE]">
        {description}
      </p>

    

    </div>
  );
}