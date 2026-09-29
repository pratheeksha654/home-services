import { ReactNode } from "react";

interface SecurityCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function SecurityCard({
  icon,
  title,
  value,
}: SecurityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14161E] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8A55E]/40 hover:shadow-[0_0_40px_rgba(200,165,94,0.18)]">

      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C8A55E]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

      <div className="relative">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8A55E]/10 text-[#C8A55E]">
          {icon}
        </div>

        <h3 className="mt-6 text-xl font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-3xl font-bold text-[#C8A55E]">
          {value}
        </p>

      </div>

    </div>
  );
}