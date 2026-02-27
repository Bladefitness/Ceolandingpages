import { Check } from "lucide-react";

interface ValueStackProps {
  items: string[];
  title?: string;
}

export function ValueStack({ items, title }: ValueStackProps) {
  return (
    <div className="rounded-xl border border-[var(--titan-border)] bg-white p-6">
      {title && (
        <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--titan-text-primary)" }}>
          {title}
        </h3>
      )}
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-3 w-3 text-emerald-600" />
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "var(--titan-text-primary)" }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
