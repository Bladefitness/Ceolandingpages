import { useState, useEffect } from "react";

const STORAGE_KEY = "titan-funnel-timer";
const DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function CountdownTimer() {
  const [remaining, setRemaining] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const end = Number(stored);
      const left = end - Date.now();
      return left > 0 ? left : 0;
    }
    const end = Date.now() + DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY, String(end));
    return DURATION_MS;
  });

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const left = Number(stored) - Date.now();
      setRemaining(left > 0 ? left : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  if (remaining <= 0) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-600">
        This offer has expired
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-6 py-3 text-center">
      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
        This special offer expires in
      </p>
      <div className="flex items-center justify-center gap-2">
        <div className="rounded bg-amber-600 px-3 py-1 text-xl font-bold text-white tabular-nums">
          {String(mins).padStart(2, "0")}
        </div>
        <span className="text-xl font-bold text-amber-600">:</span>
        <div className="rounded bg-amber-600 px-3 py-1 text-xl font-bold text-white tabular-nums">
          {String(secs).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
