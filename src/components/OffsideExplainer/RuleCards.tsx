const legend = [
  ["bg-[#ec4b4f]", "Attacking team"],
  ["bg-[#3b7bff]", "Defenders"],
  ["bg-[#facc15]", "Goalkeeper"],
  ["bg-white", "Ball"],
  ["border-t-2 border-dashed border-[#f5a623]", "Offside line"],
] as const;

export function RuleCards() {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg bg-[var(--surface-strong)] p-3 text-[var(--foreground)] lg:p-4">
      {legend.map(([swatchClassName, label]) => (
        <div
          className="flex items-center gap-2 text-[var(--text-subtle)] text-sm"
          key={label}
        >
          <span
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 rounded-full ${swatchClassName}`}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
