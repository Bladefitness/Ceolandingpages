import { X } from "lucide-react";
import { useState } from "react";

export function SkoolBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("skoolBannerDismissed") === "true";
  });

  const handleDismiss = () => {
    localStorage.setItem("skoolBannerDismissed", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">🎓</span>
            <div className="flex-1">
              <p className="text-sm md:text-base text-emerald-900 font-medium">
                <strong>Join 200+ Health Pros</strong> getting weekly coaching, tips & tricks in our free community
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href="https://skool.com/10ksidehustle/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors"
            >
              Join Free →
            </a>
            <button
              onClick={handleDismiss}
              className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
