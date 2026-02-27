import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useFunnel } from "@/contexts/FunnelContext";
import { FunnelNav } from "@/components/funnel/FunnelNav";
import { FunnelProgressBar } from "@/components/funnel/FunnelProgressBar";
import { ValueStack } from "@/components/funnel/ValueStack";
import { PricingBlock } from "@/components/funnel/PricingBlock";
import { GuaranteeBlock } from "@/components/funnel/GuaranteeBlock";

const SESSION_ITEMS = [
  "60-Minute 1-on-1 Strategy Session with Dr. Emeka",
  "Custom 90-Day Growth Plan tailored to your practice",
  "Ad Campaign Audit — Dr. Emeka reviews your current (or planned) campaigns",
];

export default function DownsellPage() {
  const { orderId, addProduct } = useFunnel();
  const [, navigate] = useLocation();
  const chargeMutation = trpc.funnel.downsell.charge.useMutation();
  const [error, setError] = useState<string | null>(null);

  // Guard disabled for preview
  // if (!orderId) {
  //   navigate("/fb-ads-course");
  //   return null;
  // }

  const handleAccept = async () => {
    setError(null);
    try {
      const result = await chargeMutation.mutateAsync({ orderId });
      if (result.success) {
        addProduct("strategy-session");
        navigate("/thank-you");
      } else {
        setError("Payment could not be processed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--titan-background)" }}>
      <FunnelNav />
      <FunnelProgressBar currentStep={3} totalSteps={3} />

      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="mb-2 text-base" style={{ color: "var(--titan-text-secondary)" }}>
          No problem — the vault isn't for everyone.
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight" style={{ color: "var(--titan-text-primary)" }}>
          How About a{" "}
          <span style={{ background: "var(--titan-grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Private Strategy Session
          </span>{" "}
          Instead?
        </h1>
        <p className="mx-auto max-w-lg text-base" style={{ color: "var(--titan-text-secondary)" }}>
          Get Dr. Emeka's undivided attention for a full hour. Walk away with a custom growth plan
          designed specifically for your practice — no fluff, just actionable strategy.
        </p>
      </section>

      <section className="mx-auto max-w-md px-4">
        <ValueStack items={SESSION_ITEMS} />
      </section>

      <section className="mx-auto max-w-md px-4 py-10 text-center">
        <PricingBlock originalPrice={497} salePrice={297} label="One-Time Special Price" />

        <button
          onClick={handleAccept}
          disabled={chargeMutation.isPending}
          className="mt-6 w-full rounded-xl px-8 py-5 text-xl font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--titan-gold) 0%, var(--titan-gold-hover) 100%)" }}
        >
          {chargeMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Processing...
            </span>
          ) : (
            "Yes, Book My Session — $297"
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={() => navigate("/thank-you")}
          className="mt-4 text-sm underline transition hover:opacity-70"
          style={{ color: "var(--titan-text-secondary)" }}
        >
          No thanks, just give me my course
        </button>
      </section>

      <section className="mx-auto max-w-md px-4 pb-16">
        <GuaranteeBlock />
      </section>
    </div>
  );
}
