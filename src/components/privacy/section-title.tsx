interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="text-center mb-14">
     

      <h2 className="mt-4 text-4xl font-bold text-[#ECEDF0]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-2xl mx-auto text-[#9CA0AE] leading-7 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}