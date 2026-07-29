import { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline";
}

export default function Button({
  children,
  variant = "solid",
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300",

        variant === "solid"
          ? "bg-[#C8A55E] text-black hover:scale-105 hover:bg-[#E4D5A8]"
          : "border border-[#e4e2df] bg-[#e4401c] text-[#090909] hover:scale-105",

        className
      )}
    >
      {children}
    </button>
  );
}