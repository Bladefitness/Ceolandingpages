import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useFunnel } from "@/contexts/FunnelContext";
import { FunnelNav } from "@/components/funnel/FunnelNav";
import { FunnelProgressBar } from "@/components/funnel/FunnelProgressBar";
import { CountdownTimer } from "@/components/funnel/CountdownTimer";
import { ValueStack } from "@/components/funnel/ValueStack";
import { PricingBlock } from "@/components/funnel/PricingBlock";
import { GuaranteeBlock } from "@/components/funnel/GuaranteeBlock";
import { SenjaTestimonials } from "@/components/funnel/SenjaTestimonials";

const VAULT_ITEMS = [
  "EVERYTHING in the FB Ads Course (you already have this!)",
  "The Complete Health Pro CEO Vault — All current & future training programs",
  "1-on-1 Strategy Session with Dr. Emeka (60 min, valued at $497)",
  "Advanced Scaling Playbook — Go from 6 to 7 figures",
  "Done-For-You Funnel Templates — Plug and play patient acquisition systems",
  "VIP Community Access — Direct line to Dr. Emeka and top performers",
  "Monthly Group Coaching Calls — Stay accountable and get live feedback",
  "Priority Support — 24-hour response guarantee on all questions",
];

export default function UpsellPage() {
  const { orderId, firstName, addProduct } = useFunnel();
  const [, navigate] = useLocation();
  const chargeMutation = trpc.funnel.upsell.charge.useMutation();
  const [error, setError] = useState<string | null>(null);

  // Guard: redirect if no orderId
  if (!orderId) {
    navigate("/fb-ads-course");
    return null;
  }

  const handleAccept = async () => {
    setError(null);
    try {
      const result = await chargeMutation.mutateAsync({ orderId: orderId! });
      if (result.success) {
        addProduct("ceo-vault");
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
      <FunnelProgressBar currentStep={2} totalSteps={3} />

      {/* Confirmation Banner */}
      <div className="border-b border-emerald-200 bg-emerald-50 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-800">
            Congratulations{firstName ? `, ${firstName}` : ""}! Your FB Ads Course access is confirmed.
          </p>
        </div>
      </div>

      {/* Pattern Interrupt */}
      <section className="mx-auto max-w-3xl px-4 pt-10 text-center">
        <p className="mb-2 text-lg font-medium" style={{ color: "var(--titan-blue)" }}>
          Wait — before you go...
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl" style={{ color: "var(--titan-text-primary)" }}>
          Upgrade to the{" "}
          <span style={{ background: "var(--titan-grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Health Pro CEO Vault
          </span>{" "}
          and Get Everything You Need to Scale
        </h1>
        <p className="mx-auto max-w-2xl text-base" style={{ color: "var(--titan-text-secondary)" }}>
          You're already ahead of 90% of health professionals. The Vault gives you the complete system
          — all trainings, templates, and a personal strategy session — to go from where you are to
          where you want to be.
        </p>
      </section>

      {/* Timer */}
      <div className="mx-auto mt-8 max-w-sm px-4">
        <CountdownTimer />
      </div>

      {/* Value Stack */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ValueStack items={VAULT_ITEMS} title="Everything Inside the CEO Vault" />
      </section>

      {/* Pricing + CTA */}
      <section className="mx-auto max-w-lg px-4 pb-6 text-center">
        <PricingBlock originalPrice={1997} salePrice={997} label="One-Time Upgrade Price" />

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
            "Yes, Upgrade Me — $997"
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={() => navigate("/offer/session")}
          className="mt-4 text-sm underline transition hover:opacity-70"
          style={{ color: "var(--titan-text-secondary)" }}
        >
          No thanks, take me to my course
        </button>
      </section>

      {/* Testimonials (Senja) */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-5xl px-4">
          <SenjaTestimonials />
        </div>
      </section>

      {/* Guarantee */}
      <section className="mx-auto max-w-lg px-4 pb-16">
        <GuaranteeBlock />
      </section>
    </div>
  );
}
