import { Shield } from "lucide-react";

interface GuaranteeBlockProps {
  days?: number;
}

export function GuaranteeBlock({ days = 30 }: GuaranteeBlockProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <Shield className="h-5 w-5 text-emerald-600" />
      </div>
      <div>
        <h4 className="font-semibold text-emerald-800">
          {days}-Day Money-Back Guarantee
        </h4>
        <p className="mt-1 text-sm text-emerald-700 leading-relaxed">
          If you don't see results within {days} days, just email us and we'll refund every penny. No questions asked.
        </p>
      </div>
    </div>
  );
}
