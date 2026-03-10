import { Star } from "lucide-react";

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
    <section className="mx-auto max-w-4xl px-4 pt-2 pb-6">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
          Choose Your Path
        </p>
        <h2 className="text-xl font-bold text-white md:text-2xl">
          How Do You Want to Grow Your Practice?
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Done-For-You / Agency Path */}
        <button
          onClick={onSelectAgency}
          className="group relative flex flex-col rounded-2xl bg-[#3a3a3a] p-8 text-left transition-all hover:bg-[#444] hover:shadow-2xl"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-lime-400">
            Hire Us to Do It For You
          </p>
          <h3 className="mb-4 text-5xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
            Agency
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            Our team builds, launches, and manages your entire ad system. You focus on patients — we focus on filling your schedule.
          </p>
          <div className="mt-auto w-full rounded-xl bg-lime-400 px-6 py-3.5 text-center text-base font-extrabold text-gray-900 transition-all group-hover:bg-lime-300 group-hover:shadow-lg">
            Get Started
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Stars count={4} half />
            <span className="text-xs font-semibold text-amber-400">4.5 stars out of 704 reviews</span>
          </div>
        </button>

        {/* DIY / Courses Path */}
        <button
          onClick={onSelectCourses}
          className="group relative flex flex-col rounded-2xl bg-[#3a3a3a] p-8 text-left transition-all hover:bg-[#444] hover:shadow-2xl"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-purple-400">
            Learn How to Do It Yourself
          </p>
          <h3 className="mb-4 text-5xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
            Courses
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            Get the exact Facebook ad playbook, templates, and training used by 500+ health practices. Master it at your own pace. Starting at $197.
          </p>
          <div className="mt-auto w-full rounded-xl bg-lime-400 px-6 py-3.5 text-center text-base font-extrabold text-gray-900 transition-all group-hover:bg-lime-300 group-hover:shadow-lg">
            Get Started
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Stars count={5} />
            <span className="text-xs font-semibold text-amber-400">4.8 stars out of 6,657 reviews</span>
          </div>
        </button>
      </div>
    </section>
  );
}
