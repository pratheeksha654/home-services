import Image from "next/image";
import BrandLogo from "./brand-logo";

export default function HeroPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between overflow-hidden bg-void">
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Professional home service technician"
          fill
          className="object-cover animate-ken-burns"
          priority
          sizes="(max-width: 1024px) 0vw, 55vw"
        />
        {/* Dark gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/40" />
        {/* Gold accent glow */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gold/[0.04] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
        {/* Top: Logo */}
        <div className="animate-fade-in-up">
          <BrandLogo size="md" variant="gold" />
        </div>

        {/* Middle: Hero Text */}
        <div className="space-y-6 max-w-lg">


          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-heading font-bold leading-[1.15] tracking-tight text-text-primary animate-fade-in-up-delay-2">
            Your Home Deserves
            <br />
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Expert Care
            </span>
          </h2>

          <p className="text-base xl:text-lg text-text-secondary/80 leading-relaxed max-w-md animate-fade-in-up-delay-3">
            Connect with verified professionals for plumbing, electrical,
            cleaning, and home services - all in one place.
          </p>
        </div>


      </div>
    </div>
  );
}

