export function CaseStudyCard3() {
  return (
    <div
      className="rounded-2xl border border-slate-700 p-6 shadow-2xl"
      style={{
        background: "#0F172A",
        boxShadow: "0 0 60px rgba(16,185,129,0.08), 0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
            Jan – June 2025
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Actively Managed
          </span>
        </div>
        <h3 className="text-xl font-bold text-white leading-tight">
          Houston Med Spa
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Performance Dashboard — Since Takeover March 1, 2025
        </p>
      </div>

      {/* Revenue Growth Hero */}
      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        {/* Badge + date row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            We Took Over
          </span>
          <span className="text-xs font-semibold text-slate-300">March 1, 2025</span>
        </div>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
          Revenue Growth Since Takeover
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: before → after */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">January (Before)</p>
              <p className="text-2xl font-bold text-slate-400">$20,676</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
              <div className="h-px w-10 bg-emerald-500/40" />
              <span className="text-lg text-emerald-400 font-bold">→</span>
              <div className="h-px w-10 bg-emerald-500/40" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">April (After)</p>
              <p className="text-2xl font-bold text-emerald-400">$131,588</p>
            </div>
          </div>
          {/* Right: summary stats */}
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-400">+536%</p>
            <p className="text-xs text-slate-400">Revenue Growth</p>
            <p className="mt-1 text-lg font-bold text-white">+$110,912</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* TOTAL REVENUE */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Total Revenue (Jan–Apr)
          </p>
          <p className="text-2xl font-bold text-emerald-400">$297,637</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <span>↑</span> Now $130K+/month
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">Across all transactions</p>
        </div>

        {/* MONTHLY AD SPEND */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Monthly Ad Spend
          </p>
          <p className="text-2xl font-bold text-emerald-400">$6,000</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <span>↑</span> 21.7x ROAS
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">$6,835 total from 5 ad sets</p>
        </div>

        {/* TOTAL CONVERSATIONS — blurred */}
        <div className="relative rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Total Conversations
            </p>
            <p className="text-2xl font-bold text-emerald-400">890</p>
            <p className="mt-1 text-xs text-slate-400">$7.68 avg CPR</p>
            <p className="mt-0.5 text-[10px] text-slate-600">Messaging conversions</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>

        {/* APPOINTMENTS BOOKED — blurred */}
        <div className="relative rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Appointments Booked
            </p>
            <p className="text-2xl font-bold text-emerald-400">104</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              70 confirmed · 67.3% rate
            </p>
            <p className="mt-0.5 text-[10px] text-slate-600">27 cancelled · 3 no-shows</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>

        {/* CAMPAIGN CLICKS */}
        <div className="col-span-2 rounded-xl border border-slate-700 bg-[#1E293B] p-4 sm:col-span-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Campaign Clicks
          </p>
          <p className="text-2xl font-bold text-emerald-400">3,260</p>
          <p className="mt-1 text-xs text-amber-400">$0.84 avg CPC</p>
          <p className="mt-0.5 text-[10px] text-slate-600">2.58% avg CTR · 34,357 impressions</p>
        </div>
      </div>

      {/* Monthly Revenue Breakdown */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Monthly Revenue Breakdown
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* January 2025 */}
          <div
            className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
            style={{ borderTop: "3px solid #F59E0B" }}
          >
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                BEFORE
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold text-slate-400">January 2025</p>
            <p className="text-2xl font-bold text-slate-400">$20,676</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS</span>
                <span className="font-semibold text-slate-400">Baseline</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GROWTH</span>
                <span className="font-semibold text-slate-400">—</span>
              </div>
            </div>
          </div>

          {/* February 2025 */}
          <div
            className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
            style={{ borderTop: "3px solid #6366F1" }}
          >
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                BEFORE
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold text-slate-400">February 2025</p>
            <p className="text-2xl font-bold text-indigo-400">$76,679</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">MOM GROWTH</span>
                <span className="font-semibold text-emerald-400">+271%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VS. JAN</span>
                <span className="font-semibold text-emerald-400">+$56K</span>
              </div>
            </div>
          </div>

          {/* March 2025 */}
          <div
            className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
            style={{ borderTop: "3px solid #A855F7" }}
          >
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                TAKEOVER
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold text-slate-400">March 2025</p>
            <p className="text-2xl font-bold text-purple-400">$68,692</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">MOM GROWTH</span>
                <span className="font-semibold text-red-400">-10.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS</span>
                <span className="font-semibold text-amber-400">Rebuilding</span>
              </div>
            </div>
          </div>

          {/* April 2025 */}
          <div
            className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
            style={{ borderTop: "3px solid #10B981" }}
          >
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                SCALED
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold text-slate-400">April 2025</p>
            <p className="text-2xl font-bold text-emerald-400">$131,588</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">MOM GROWTH</span>
                <span className="font-semibold text-emerald-400">+91.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VS. JAN</span>
                <span className="font-semibold text-emerald-400">+536%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
        <p className="text-xs text-slate-500">
          Results from a real HealthProCEO Agency client
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <svg
            className="h-3.5 w-3.5 text-emerald-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 13l-3-3 1.41-1.41L11 12.17l5.59-5.58L18 8l-7 7z" />
          </svg>
          Verified case study
        </span>
      </div>
    </div>
  );
}
