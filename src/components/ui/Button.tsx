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
          ? "bg-[#C8A55E]/15 text-[#C8A55E] backdrop-blur-md hover:scale-105 hover:bg-[#C8A55E]/25"
          : "bg-[#e4401c]/15 text-[#e4401c] backdrop-blur-md hover:scale-105 hover:bg-[#e4401c]/25",

        className
      )}
    >
      {children}
    </button>
  );
}