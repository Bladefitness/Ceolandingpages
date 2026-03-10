export function CaseStudyCard2() {
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
            Oct 1 – Dec 31, 2025
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Campaign Complete
          </span>
        </div>
        <h3 className="text-xl font-bold text-white leading-tight">
          All About Beautiful Smiles
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Q4 2025 Performance Dashboard — Meta Ads + Revenue Overview
        </p>
      </div>

      {/* Revenue Growth Hero */}
      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
          Revenue Growth — Q4 2025
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: progression */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">October</p>
              <p className="text-2xl font-bold text-amber-400">$142,000</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
              <div className="h-px w-10 bg-emerald-500/40" />
              <span className="text-[10px] text-emerald-400 font-semibold">+42.3%</span>
              <div className="h-px w-10 bg-emerald-500/40" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">December</p>
              <p className="text-2xl font-bold text-emerald-400">$202,000</p>
            </div>
          </div>
          {/* Right: summary stats */}
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">+42.3%</p>
            <p className="text-xs text-slate-400">Quarter-over-Quarter Growth</p>
            <p className="mt-1 text-lg font-bold text-white">+$60,000</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* TOTAL REVENUE */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Total Revenue (Q4)
          </p>
          <p className="text-2xl font-bold text-white">$516K</p>
          <p className="mt-1 text-xs text-slate-500">42.3% growth Oct→Dec</p>
          <p className="mt-0.5 text-[10px] text-slate-600">$142K + $172K + $202K</p>
        </div>

        {/* TOTAL AD SPEND */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Total Ad Spend
          </p>
          <p className="text-2xl font-bold text-white">$26,560</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <span>↑</span> 19.4x ROAS
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">Across 6 active campaigns</p>
        </div>

        {/* TOTAL LEADS — blurred */}
        <div className="relative rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Total Leads
            </p>
            <p className="text-2xl font-bold text-white">2,384</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              <span>↑</span> $11.14 avg CPL
            </p>
            <p className="mt-0.5 text-[10px] text-slate-600">Pixel + lead form combined</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>

        {/* TOTAL REACH */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Total Reach
          </p>
          <p className="text-2xl font-bold text-white">555.7K</p>
          <p className="mt-1 text-xs text-amber-400">1.95 avg frequency</p>
          <p className="mt-0.5 text-[10px] text-slate-600">1.15M total impressions</p>
        </div>

        {/* LINK CLICKS — blurred */}
        <div className="relative col-span-2 rounded-xl border border-slate-700 bg-[#1E293B] p-4 sm:col-span-1">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Link Clicks
            </p>
            <p className="text-2xl font-bold text-white">18,314</p>
            <p className="mt-1 text-xs text-amber-400">$1.45 avg CPC</p>
            <p className="mt-0.5 text-[10px] text-slate-600">1.55% avg CTR</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* October */}
        <div
          className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
          style={{ borderTop: "3px solid #F59E0B" }}
        >
          <p className="mb-3 text-xs font-semibold text-slate-400">October 2025</p>
          <p className="text-3xl font-bold text-amber-400">$142,000</p>
          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Est. Ad Spend</span>
              <span className="text-slate-300 font-medium">$7,800</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Leads</span>
              <span className="text-slate-300 font-medium">680</span>
            </div>
            <div className="flex justify-between">
              <span>ROAS</span>
              <span className="text-emerald-400 font-semibold">18.2x</span>
            </div>
          </div>
          <div className="mt-3 rounded-md bg-slate-800 px-2.5 py-1.5 text-center">
            <span className="text-[10px] font-semibold text-amber-400">Baseline Start</span>
          </div>
        </div>

        {/* November */}
        <div
          className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
          style={{ borderTop: "3px solid #A855F7" }}
        >
          <p className="mb-3 text-xs font-semibold text-slate-400">November 2025</p>
          <p className="text-3xl font-bold text-purple-400">$172,000</p>
          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Est. Ad Spend</span>
              <span className="text-slate-300 font-medium">$9,200</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Leads</span>
              <span className="text-slate-300 font-medium">820</span>
            </div>
            <div className="flex justify-between">
              <span>ROAS</span>
              <span className="text-emerald-400 font-semibold">18.7x</span>
            </div>
          </div>
          <div className="mt-3 rounded-md bg-slate-800 px-2.5 py-1.5 text-center">
            <span className="text-[10px] font-semibold text-purple-400">MoM Growth +21.1%</span>
          </div>
        </div>

        {/* December */}
        <div
          className="rounded-xl border border-slate-700 bg-[#1E293B] p-4"
          style={{ borderTop: "3px solid #10B981" }}
        >
          <p className="mb-3 text-xs font-semibold text-slate-400">December 2025</p>
          <p className="text-3xl font-bold text-emerald-400">$202,000</p>
          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Est. Ad Spend</span>
              <span className="text-slate-300 font-medium">$9,560</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Leads</span>
              <span className="text-slate-300 font-medium">884</span>
            </div>
            <div className="flex justify-between">
              <span>ROAS</span>
              <span className="text-emerald-400 font-semibold">21.1x</span>
            </div>
          </div>
          <div className="mt-3 rounded-md bg-slate-800 px-2.5 py-1.5 text-center">
            <span className="text-[10px] font-semibold text-emerald-400">MoM Growth +17.4%</span>
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
