"use client";

import { useState } from "react";
import Link from "next/link";

interface TermsCheckboxProps {
  /** Controlled mode: external checked state */
  checked?: boolean;
  /** Callback when the checkbox value changes */
  onChange?: (checked: boolean) => void;
  /** Unique id for the checkbox element */
  id?: string;
  /** Show validation error styling */
  error?: boolean;
}

/**
 * Reusable Terms & Conditions consent checkbox.
 * Use in signup forms, booking flows, etc.
 *
 * @example
 * <TermsCheckbox
 *   checked={agreed}
 *   onChange={setAgreed}
 *   id="signup-terms"
 *   error={!agreed && submitted}
 * />
 */
export default function TermsCheckbox({
  checked: controlledChecked,
  onChange,
  id = "terms-agree",
  error = false,
}: TermsCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div
      className={`flex items-start gap-3 ${error ? "animate-[shake_0.3s_ease-in-out]" : ""}`}
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={handleChange}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={`
            flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer
            transition-all duration-200
            ${
              isChecked
                ? "bg-gold border-gold"
                : error
                  ? "border-red-500/60 bg-red-500/5"
                  : "border-text-ghost bg-transparent hover:border-gold-muted"
            }
          `}
        >
          {isChecked && (
            <svg
              className="w-3.5 h-3.5 text-obsidian"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </label>
      </div>
      <label
        htmlFor={id}
        className={`text-sm leading-relaxed cursor-pointer ${error ? "text-red-400" : "text-text-secondary"}`}
      >
        I agree to the{" "}
        <Link
          href="/terms"
          className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          Privacy Policy
        </Link>{" "}
        of HomeFixPro.
      </label>
    </div>
  );
}
