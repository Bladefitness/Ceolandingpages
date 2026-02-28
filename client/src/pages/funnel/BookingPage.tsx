import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Clock, Users, Target, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useFunnel } from "@/contexts/FunnelContext";
import { FunnelNav } from "@/components/funnel/FunnelNav";
import { SenjaTestimonials } from "@/components/funnel/SenjaTestimonials";
import { getSessionId } from "@/lib/funnelTracking";

const GHL_BOOKING_URL = "https://links.doctorleadflow.com/widget/booking/9UjOQl0JVnNqG41Uboyh";

const WHAT_TO_EXPECT = [
  { icon: Clock, text: "60-minute deep-dive strategy session" },
  { icon: Target, text: "Custom growth plan tailored to your practice" },
  { icon: MessageSquare, text: "Ad campaign audit & optimization roadmap" },
  { icon: Users, text: "Actionable next steps you can implement immediately" },
];

export default function BookingPage() {
  const { orderId, firstName, purchasedProducts } = useFunnel();
  const [, navigate] = useLocation();

  const cmsQuery = trpc.funnelAdmin.pages.getPublic.useQuery({ slug: "book-session" });
  const cmsContent = cmsQuery.data;

  const sessionId = getSessionId();
  const trackEvent = trpc.funnelAdmin.events.track.useMutation();

  useEffect(() => {
    if (sessionId) {
      trackEvent.mutate({
        sessionId,
        eventType: "page_view",
        pageSlug: "book-session",
        orderId: orderId ?? undefined,
      });
    }
  }, [sessionId]);

  // Guard: redirect if no orderId (skip in preview mode)
  const isPreview = new URLSearchParams(window.location.search).has("preview");
  if (!orderId && !isPreview) {
    navigate("/fb-ads-course");
    return null;
  }

  const hasVault = purchasedProducts.includes("ceo-vault");
  const productLabel = hasVault ? "CEO Vault" : "Strategy Session";

  return (
    <div className="min-h-screen" style={{ background: "var(--titan-background)" }}>
      <FunnelNav />

      {/* Confirmation Banner */}
      <div className="border-b border-emerald-200 bg-emerald-50 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-800">
            {cmsContent?.headline ??
              `Your ${productLabel} access is confirmed${firstName ? `, ${firstName}` : ""}! Now book your strategy call.`}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: Calendar Embed */}
          <div>
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ color: "var(--titan-text-primary)" }}
            >
              {cmsContent?.subheadline ?? "Pick a Time That Works for You"}
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--titan-text-secondary)" }}
            >
              Select a date and time below to schedule your 1-on-1 strategy call with Dr. Emeka.
            </p>
            <div className="overflow-hidden rounded-2xl border border-[var(--titan-border)] bg-white shadow-sm">
              <iframe
                src={GHL_BOOKING_URL}
                className="h-[700px] w-full border-0"
                title="Book Your Strategy Session"
                allow="camera; microphone"
              />
            </div>
          </div>

          {/* Right: What to Expect + Testimonials */}
          <div>
            <div className="mb-8 rounded-2xl border border-[var(--titan-border)] bg-white p-6 shadow-sm">
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: "var(--titan-text-primary)" }}
              >
                What to Expect
              </h3>
              <div className="space-y-4">
                {WHAT_TO_EXPECT.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <p
                      className="pt-1.5 text-sm"
                      style={{ color: "var(--titan-text-primary)" }}
                    >
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* After booking, link to call prep */}
            <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center">
              <p className="mb-2 text-sm font-medium text-blue-800">
                Already booked?
              </p>
              <a
                href="/call-prep"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, var(--titan-blue) 0%, var(--titan-blue-hover) 100%)",
                }}
              >
                Go to Call Prep Page →
              </a>
            </div>

            {/* Testimonials */}
            <SenjaTestimonials />
          </div>
        </div>
      </div>
    </div>
  );
}
