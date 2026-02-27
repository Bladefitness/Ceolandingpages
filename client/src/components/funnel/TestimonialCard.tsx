import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  photoUrl?: string;
}

export function TestimonialCard({ name, role, quote, photoUrl }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-[var(--titan-border)] bg-white p-6 shadow-sm">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-4 text-sm italic leading-relaxed" style={{ color: "var(--titan-text-primary)" }}>
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--titan-text-primary)" }}>{name}</p>
          <p className="text-xs" style={{ color: "var(--titan-text-secondary)" }}>{role}</p>
        </div>
      </div>
    </div>
  );
}
