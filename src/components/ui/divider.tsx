export default function Divider({ text }: { text: string }) {
  return (
    <div className="relative flex items-center py-0.5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-hover to-transparent" />
      <span className="mx-4 text-[10px] font-semibold text-text-muted tracking-[0.15em] uppercase select-none">
        {text}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-hover to-transparent" />
    </div>
  );
}
