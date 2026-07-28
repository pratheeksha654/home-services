import React from "react";

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  id?: string;
  disabled?: boolean;
}

export default function GlassButton({
  children,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
  id,
  disabled = false,
}: GlassButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-out cursor-pointer focus-ring overflow-hidden";

  const variants = {
    primary: `
      bg-gradient-to-r from-gold via-gold-light to-gold
      text-obsidian
      shadow-[0_2px_16px_rgba(200,165,94,0.25)]
      hover:shadow-[0_4px_24px_rgba(200,165,94,0.35)]
      hover:scale-[1.01] hover:brightness-105
      active:scale-[0.98] active:brightness-95
    `,
    secondary: `
      bg-surface border border-border
      text-text-primary
      hover:bg-surface-hover hover:border-border-hover
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent
      text-gold
      hover:text-gold-light hover:bg-surface
      active:scale-[0.98]
    `,
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Shimmer overlay for primary */}
      {variant === "primary" && (
        <span
          className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-[shimmer-slide_3s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </button>
  );
}
