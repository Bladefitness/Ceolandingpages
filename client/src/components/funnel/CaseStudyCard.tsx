export function CaseStudyCard() {
  // SVG chart dimensions
  const chartW = 500;
  const chartH = 200;
  const padL = 12;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  // Month labels: Feb '25 … Feb '26 (13 points = 12 intervals)
  const months = ["Feb '25", "Apr '25", "Jun '25", "Aug '25", "Oct '25", "Dec '25", "Feb '26"];
  // Horizontal positions for 7 labels across 13 data points (every 2 intervals)
  const labelXRatios = [0, 2 / 12, 4 / 12, 6 / 12, 8 / 12, 10 / 12, 1];

  // Revenue data (13 monthly points Jan'25 – Feb'26), in thousands
  // Before takeover (Nov = index 10), gradual growth; after, hockey stick
  const revenueK = [5.2, 5.8, 6.4, 7.1, 8.0, 9.2, 10.5, 12.0, 13.8, 16.0, 22.5, 30.2, 38.0];
  // Spend data — roughly flat $1–2K
  const spendK = [1.3, 1.4, 1.5, 1.4, 1.6, 1.5, 1.7, 1.6, 1.8, 1.7, 2.1, 2.0, 1.9];

  const maxVal = 40; // chart ceiling in K

  const toX = (i: number) => padL + (i / (revenueK.length - 1)) * innerW;
  const toY = (v: number) => padT + innerH - (v / maxVal) * innerH;

  const revenuePoints = revenueK.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const spendPoints = spendK.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  // Area fill path for revenue line
  const revAreaPath =
    `M ${toX(0)},${toY(revenueK[0])} ` +
    revenueK.map((v, i) => `L ${toX(i)},${toY(v)}`).join(" ") +
    ` L ${toX(revenueK.length - 1)},${padT + innerH} L ${toX(0)},${padT + innerH} Z`;

  // Takeover is at index 10 (Nov '25) out of 12 intervals
  const takeoverX = toX(10);

  // Gridlines at 0, 10K, 20K, 30K, 40K
  const gridLines = [0, 10, 20, 30, 40];

  return (
    <div
      className="rounded-2xl border border-slate-700 p-6 shadow-2xl"
      style={{
        background: "#0F172A",
        boxShadow: "0 0 60px rgba(245,158,11,0.08), 0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Live Client Results
            </span>
          </div>
          <h3 className="text-xl font-bold text-white leading-tight">
            The Vitality &amp; Aesthetics Institute
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Revenue &amp; Ad Campaign Analytics · Jan 2025 – Feb 2026
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span>⚡</span> Marketing Takeover: Nov 15, 2025
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span>↑</span> ROAS: 12.9x
          </span>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* NET REVENUE */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Net Revenue
          </p>
          <p className="text-2xl font-bold text-white">$251,635</p>
          <p className="mt-1 text-xs text-slate-500">~966 transactions</p>
        </div>

        {/* AD SPEND */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Ad Spend
          </p>
          <p className="text-2xl font-bold text-white">$19,548</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <span>↑</span> 12.9x ROAS
          </p>
        </div>

        {/* CRM PIPELINE — blurred */}
        <div className="relative rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              CRM Pipeline
            </p>
            <p className="text-2xl font-bold text-white">819</p>
            <p className="mt-1 text-xs text-slate-500">$24 CPL from $19.5K</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>

        {/* IMPRESSIONS */}
        <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Impressions
          </p>
          <p className="text-2xl font-bold text-white">583.4K</p>
          <p className="mt-1 text-xs text-slate-500">20.9K clicks · 3.58% CTR</p>
        </div>

        {/* DAILY AVG — blurred */}
        <div className="relative col-span-2 rounded-xl border border-slate-700 bg-[#1E293B] p-4 sm:col-span-1">
          <div className="select-none blur-[6px]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Daily Avg (Post)
            </p>
            <p className="text-2xl font-bold text-white">$1,151</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              <span>↑</span> +182% <span className="text-slate-500">was $408</span>
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              Client Only
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Growth Chart */}
      <div className="rounded-xl border border-slate-700 bg-[#1E293B] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white">Revenue Growth</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-5 rounded-full bg-amber-400" />
              Monthly Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-5 rounded-full bg-teal-400" />
              Ad Spend
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full"
            style={{ minWidth: "280px", height: "auto", maxHeight: "200px" }}
            aria-label="Revenue and ad spend growth chart"
          >
            {/* Grid lines */}
            {gridLines.map((g) => {
              const y = toY(g);
              return (
                <g key={g}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={padL + innerW}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={g === 0 ? "0" : "4 4"}
                  />
                  <text
                    x={padL - 2}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="8"
                    fill="#64748b"
                  >
                    {g > 0 ? `$${g}K` : ""}
                  </text>
                </g>
              );
            })}

            {/* Revenue area fill */}
            <path d={revAreaPath} fill="url(#revenueGrad)" opacity="0.25" />

            {/* Revenue line */}
            <polyline
              points={revenuePoints}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Spend line */}
            <polyline
              points={spendPoints}
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="5 3"
            />

            {/* Takeover vertical dashed line */}
            <line
              x1={takeoverX}
              y1={padT}
              x2={takeoverX}
              y2={padT + innerH}
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            <text
              x={takeoverX + 4}
              y={padT + 14}
              fontSize="8"
              fill="#F59E0B"
              fontWeight="bold"
            >
              ⚡ Takeover
            </text>

            {/* Revenue endpoint dot */}
            <circle
              cx={toX(revenueK.length - 1)}
              cy={toY(revenueK[revenueK.length - 1])}
              r="4"
              fill="#F59E0B"
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Month labels */}
            {labelXRatios.map((ratio, i) => (
              <text
                key={i}
                x={padL + ratio * innerW}
                y={chartH - 6}
                textAnchor="middle"
                fontSize="8"
                fill="#64748b"
              >
                {months[i]}
              </text>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
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
