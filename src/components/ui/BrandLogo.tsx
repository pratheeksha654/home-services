import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "gold";
}

export default function BrandLogo({ size = "md", variant = "gold" }: BrandLogoProps) {
  const dimensions = {
    sm: { img: 28, text: "text-base" },
    md: { img: 36, text: "text-lg" },
    lg: { img: 44, text: "text-2xl" },
  };

  const { img, text } = dimensions[size];

  const textColor =
    variant === "gold"
      ? "bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"
      : "text-text-primary";

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <Image
          src="/logo.png"
          alt="HomeFixPro Logo"
          width={img}
          height={img}
          className="drop-shadow-[0_0_10px_rgba(200,165,94,0.2)]"
          priority
        />
      </div>
      <span className={`${text} font-heading font-bold tracking-tight ${textColor}`}>
        HomeFixPro
      </span>
    </div>
  );
}
