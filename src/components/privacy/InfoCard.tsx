import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
}

export default function InfoCard({
  icon,
  title,
  description,
  items,
}: InfoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14161E] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8A55E]/40 hover:shadow-[0_0_30px_rgba(200,165,94,0.15)]">

      {/* Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C8A55E]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all"></div>

      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8A55E]/10 text-[#C8A55E]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-[#9CA0AE] leading-7">
        {description}
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-white/10"></div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle2
              size={18}
              className="text-[#C8A55E]"
            />
            <span className="text-[#ECEDF0]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}