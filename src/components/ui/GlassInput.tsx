"use client";

import React from "react";

interface GlassInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function GlassInput({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  rightIcon,
  onRightIconClick,
  value,
  onChange,
}: GlassInputProps) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold text-text-secondary mb-2 ml-0.5 tracking-[0.08em] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        {/* Left icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted group-focus-within:text-gold transition-colors duration-300">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            focus-ring w-full rounded-xl
            border border-border
            bg-surface py-3 pl-12 pr-12
            text-sm text-text-primary placeholder:text-text-ghost
            transition-all duration-300 ease-out
            hover:border-border-hover hover:bg-surface-hover
            focus:border-border-gold focus:bg-surface-raised
            focus:shadow-[0_0_0_3px_rgba(200,165,94,0.08)]
          "
        />

        {/* Right icon (show/hide password) */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-gold-light transition-colors duration-300 cursor-pointer"
            tabIndex={-1}
            aria-label="Toggle visibility"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}
