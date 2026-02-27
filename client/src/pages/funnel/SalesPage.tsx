import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Play, Users, TrendingUp, Award, ChevronDown } from "lucide-react";
import { getStripePromise } from "@/lib/stripe";
import { trpc } from "@/lib/trpc";
import { useFunnel } from "@/contexts/FunnelContext";
import { FunnelNav } from "@/components/funnel/FunnelNav";
import { ValueStack } from "@/components/funnel/ValueStack";
import { PricingBlock } from "@/components/funnel/PricingBlock";
import { GuaranteeBlock } from "@/components/funnel/GuaranteeBlock";
import { SenjaTestimonials } from "@/components/funnel/SenjaTestimonials";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Valid email is required"),
});

type FormValues = z.infer<typeof formSchema>;

const VALUE_ITEMS = [
  "Complete FB Ads Masterclass — 12 video modules covering targeting, creative, and scaling",
  "Done-For-You Ad Templates — Copy-paste ads proven to convert for health professionals",
  "Audience Targeting Blueprint — Find your ideal patients on Facebook & Instagram",
  "Ad Creative Swipe File — 50+ high-converting image and video ad examples",
  "Campaign Budget Optimizer Guide — Get more leads without increasing ad spend",
  "BONUS: Weekly Live Q&A Access — Get your ads reviewed by our team for 30 days",
  "BONUS: Private Community Access — Network with other health pros running profitable ads",
  "BONUS: Quick-Start Checklist — Launch your first campaign in 48 hours",
];

const FAQ_ITEMS = [
  {
    q: "How quickly will I see results?",
    a: "Most students launch their first campaign within 48 hours and start seeing leads within the first week. Full optimization typically happens within 2-4 weeks.",
  },
  {
    q: "Do I need a big ad budget to start?",
    a: "No. We teach you how to start with as little as $10/day and scale profitably. The strategies work at any budget level.",
  },
  {
    q: "What if I've never run Facebook ads before?",
    a: "This course is designed for beginners. We walk you through everything step-by-step, from setting up your ad account to launching your first campaign.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes! You have a full 30-day money-back guarantee. If you're not satisfied, just email us for a complete refund.",
  },
];

function CheckoutForm({ clientSecret, orderId }: { clientSecret: string; orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [, navigate] = useLocation();
  const { setOrder, addProduct } = useFunnel();
  const confirmMutation = trpc.funnel.checkout.confirmPurchase.useMutation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/thank-you" },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await confirmMutation.mutateAsync({
        orderId,
        paymentIntentId: paymentIntent.id,
      });
      addProduct("fb-ads-course");
      navigate("/offer/vault");
    } else {
      setError("Payment was not completed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, var(--titan-gold) 0%, var(--titan-gold-hover) 100%)" }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Processing...
          </span>
        ) : (
          "Get Instant Access — $197"
        )}
      </button>
    </form>
  );
}

export default function SalesPage() {
  const { setOrder } = useFunnel();
  const createIntent = trpc.funnel.checkout.createIntent.useMutation();
  const [checkoutData, setCheckoutData] = useState<{ clientSecret: string; orderId: number } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createIntent.mutateAsync(values);
    setOrder(result.orderId, values.email, values.firstName);
    setCheckoutData({ clientSecret: result.clientSecret, orderId: result.orderId });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--titan-background)" }}>
      <FunnelNav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
          For Health Professionals Only
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl" style={{ color: "var(--titan-text-primary)" }}>
          The Exact Facebook Ad System That Fills Health Practices With{" "}
          <span style={{ background: "var(--titan-grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            20+ New Patients Per Month
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg" style={{ color: "var(--titan-text-secondary)" }}>
          Stop wasting money on ads that don't convert. Learn the proven system used by 500+ health professionals
          to predictably generate high-quality patient leads on autopilot.
        </p>

        {/* VSL Placeholder */}
        <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--titan-border)] bg-gray-900 shadow-xl" style={{ aspectRatio: "16/9" }}>
          <div className="flex h-full items-center justify-center">
            <button className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
              <Play className="ml-1 h-8 w-8 text-white" fill="white" />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-[var(--titan-border)] bg-white py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4">
          {[
            { icon: Users, label: "500+ Students" },
            { icon: TrendingUp, label: "3.2x Avg. ROI" },
            { icon: Award, label: "4.9/5 Rating" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-semibold" style={{ color: "var(--titan-text-primary)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Value Stack */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ color: "var(--titan-text-primary)" }}>
          Everything You Get Inside
        </h2>
        <ValueStack items={VALUE_ITEMS} />
      </section>

      {/* Testimonials (Senja) */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold" style={{ color: "var(--titan-text-primary)" }}>
            What Health Professionals Are Saying
          </h2>
          <SenjaTestimonials />
        </div>
      </section>

      {/* Pricing + Checkout */}
      <section id="checkout" className="mx-auto max-w-lg px-4 py-12">
        <PricingBlock originalPrice={297} salePrice={197} label="Special Launch Price" />

        <div className="mt-8 rounded-2xl border border-[var(--titan-border)] bg-white p-6 shadow-lg">
          {!checkoutData ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--titan-text-primary)" }}>
                  First Name
                </label>
                <input
                  {...form.register("firstName")}
                  placeholder="Your first name"
                  className="w-full rounded-lg border border-[var(--titan-border)] px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {form.formState.errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: "var(--titan-text-primary)" }}>
                  Email Address
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[var(--titan-border)] px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={createIntent.isPending}
                className="w-full rounded-xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--titan-gold) 0%, var(--titan-gold-hover) 100%)" }}
              >
                {createIntent.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Setting up checkout...
                  </span>
                ) : (
                  "Continue to Payment — $197"
                )}
              </button>
              {createIntent.isError && (
                <p className="text-center text-sm text-red-500">
                  {createIntent.error.message}
                </p>
              )}
            </form>
          ) : (
            <Elements
              stripe={getStripePromise()}
              options={{
                clientSecret: checkoutData.clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: { colorPrimary: "#0EA5E9", borderRadius: "8px" },
                },
              }}
            >
              <CheckoutForm clientSecret={checkoutData.clientSecret} orderId={checkoutData.orderId} />
            </Elements>
          )}
        </div>

        <div className="mt-6">
          <GuaranteeBlock />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 pb-16">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ color: "var(--titan-text-primary)" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--titan-border)] bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold" style={{ color: "var(--titan-text-primary)" }}>{item.q}</span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: "var(--titan-text-secondary)" }} />
              </button>
              {openFaq === i && (
                <div className="border-t border-[var(--titan-border)] px-5 py-4">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--titan-text-secondary)" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
