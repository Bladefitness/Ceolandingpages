interface PricingBlockProps {
  originalPrice: number;
  salePrice: number;
  label?: string;
}

export function PricingBlock({ originalPrice, salePrice, label }: PricingBlockProps) {
  const savings = originalPrice - salePrice;

  return (
    <div className="text-center">
      {label && (
        <p className="mb-1 text-sm font-medium uppercase tracking-wide" style={{ color: "var(--titan-text-secondary)" }}>
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl text-gray-400 line-through">${originalPrice}</span>
        <span className="text-5xl font-bold" style={{ color: "var(--titan-text-primary)" }}>
          ${salePrice}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-emerald-600">
        You save ${savings} today
      </p>
    </div>
  );
}
