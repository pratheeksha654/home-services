export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-chinese-black via-chinese-black-deep to-chinese-black" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96,126,162,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,126,162,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb 1 – top right */}
      <div
        className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, #314B6E 0%, transparent 70%)",
          animation: "float-slow 20s ease-in-out infinite",
        }}
      />

      {/* Glow orb 2 – bottom left */}
      <div
        className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, #607EA2 0%, transparent 70%)",
          animation: "float-slow-reverse 25s ease-in-out infinite",
        }}
      />

      {/* Glow orb 3 – center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, #8197AC 0%, transparent 70%)",
          animation: "pulse-glow 8s ease-in-out infinite",
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(8,12,18,0.6) 100%)",
        }}
      />
    </div>
  );
}
