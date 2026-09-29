// components/technicianForm/FormHeader.tsx

export default function FormHeader() {
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-[#151922] p-8">
      <h1 className="text-3xl font-bold text-white">
        Become a Technician
      </h1>

      <p className="mt-3 text-gray-400">
        Fill in your details to apply as a FixNest technician. Your
        application will be reviewed by our team before approval.
      </p>
    </div>
  );
}