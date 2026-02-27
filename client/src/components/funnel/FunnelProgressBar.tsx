interface FunnelProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function FunnelProgressBar({ currentStep, totalSteps }: FunnelProgressBarProps) {
  const pct = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-100 py-3">
      <div className="mx-auto max-w-md px-4">
        <div className="mb-1 flex justify-between text-xs font-medium" style={{ color: "var(--titan-text-secondary)" }}>
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(pct)}% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "var(--titan-grad-primary)" }}
          />
        </div>
      </div>
    </div>
  );
}
