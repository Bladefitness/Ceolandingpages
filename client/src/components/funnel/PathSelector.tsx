import { Star, Zap, Shield } from "lucide-react";

interface PathSelectorProps {
  onSelectCourses: () => void;
  onSelectAgency: () => void;
}

function Stars({ count, half }: { count: number; half?: boolean }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
      {half && <Star className="h-4 w-4 fill-amber-400/50 text-amber-400" />}
    </span>
  );
}

export function PathSelector({ onSelectCourses, onSelectAgency }: PathSelectorProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-2 pb-2">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--titan-blue)]">
          Choose Your Path
        </p>
        <h2 className="text-xl font-bold md:text-2xl" style={{ color: "var(--titan-text-primary)" }}>
          How Do You Want to Grow Your Practice?
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Done-For-You / Agency Path */}
        <button
          onClick={onSelectAgency}
          className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E293B] px-7 py-10 text-left shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] md:px-8"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[var(--titan-indigo)]">
            Hire Us to Do It For You
          </p>
          <h3 className="mb-4 text-[clamp(2.5rem,6vw,4rem)] font-black uppercase leading-none tracking-tight text-white">
            Agency
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-slate-300">
            We build your entire patient acquisition machine — ads, AI chatbots, and automations that book appointments while you sleep. You focus on patients, we fill your schedule.
          </p>

          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Zap className="h-4 w-4 flex-shrink-0 fill-amber-300 text-amber-300" />
            Closing new patients in 14 days
          </div>

          <div
            className="w-full rounded-xl px-6 py-4 text-center text-lg font-extrabold text-white shadow-md transition-all group-hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--titan-gold), var(--titan-gold-hover))" }}
          >
            Book a Free Strategy Call
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5 flex-shrink-0" />
            Done-for-you setup · ROI guaranteed
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars count={4} half />
            <span className="text-xs font-semibold text-amber-400">4.5 stars — 200+ practices scaled</span>
          </div>
        </button>

        {/* DIY / Courses Path */}
        <button
          onClick={onSelectCourses}
          className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E293B] px-7 py-10 text-left shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] md:px-8"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[var(--titan-blue)]">
            Learn How to Do It Yourself
          </p>
          <h3 className="mb-4 text-[clamp(2.5rem,6vw,4rem)] font-black uppercase leading-none tracking-tight text-white">
            Courses
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-slate-300">
            The exact system behind 15,000+ patient leads. Master Facebook ads at your own pace and stop paying agencies $3,000/mo for something you can do better yourself.
          </p>

          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Zap className="h-4 w-4 flex-shrink-0 fill-amber-300 text-amber-300" />
            Launch your first campaign in 48 hours
          </div>

          <div
            className="w-full rounded-xl px-6 py-4 text-center text-lg font-extrabold text-white shadow-md transition-all group-hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--titan-gold), var(--titan-gold-hover))" }}
          >
            Get Started
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5 flex-shrink-0" />
            30-day money-back guarantee
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars count={5} />
            <span className="text-xs font-semibold text-amber-400">4.8 stars — 200+ health pros enrolled</span>
          </div>
        </button>
      </div>
    </section>
  );
}
