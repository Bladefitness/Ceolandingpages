import { ArrowRight, TrendingUp, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface GapAnalysis {
  currentRevenue: string;
  currentLeads: number;
  currentCloseRate: number;
  potentialRevenue: string;
  potentialLeads: number;
  potentialCloseRate: number;
}

interface Props {
  analysis: GapAnalysis;
}

export function GapAnalysisCard({ analysis }: Props) {
  return (
    <div 
      className="p-6 sm:p-8 rounded-lg"
      style={{ background: 'var(--titan-white)' }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6" style={{ color: 'var(--titan-blue)' }} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
          Your Growth Potential
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center">
              <Info className="w-4 h-4" style={{ color: 'var(--titan-blue)' }} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-sm">
              These projections show what's achievable in 18 months by implementing the recommended strategies. Calculations are based on industry benchmarks for practices that fixed similar bottlenecks. Results assume consistent implementation of playbook recommendations.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <p className="text-sm mb-6" style={{ color: 'var(--titan-text-muted)' }}>
        Based on your current setup, here's what's possible when you fix your bottlenecks:
      </p>

      <div className="space-y-6">
        {/* Revenue */}
        <div>
          <p className="text-sm mb-3 font-medium" style={{ color: 'var(--titan-text-primary)' }}>
            Monthly Revenue
          </p>
          <div className="flex items-center gap-4">
            <div 
              className="flex-1 p-4 rounded-lg text-center"
              style={{ background: 'var(--titan-background)' }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-text-muted)' }}>
                Current
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
                {analysis.currentRevenue}
              </div>
            </div>
            <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--titan-blue)' }} />
            <div 
              className="flex-1 p-4 rounded-lg text-center border-2"
              style={{ 
                background: 'rgba(229, 193, 88, 0.1)',
                borderColor: 'var(--titan-blue)'
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-blue)' }}>
                Potential
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-blue)' }}>
                {analysis.potentialRevenue}
              </div>
            </div>
          </div>
        </div>

        {/* Leads */}
        <div>
          <p className="text-sm mb-3 font-medium" style={{ color: 'var(--titan-text-primary)' }}>
            Monthly Leads
          </p>
          <div className="flex items-center gap-4">
            <div 
              className="flex-1 p-4 rounded-lg text-center"
              style={{ background: 'var(--titan-background)' }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-text-muted)' }}>
                Current
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
                {analysis.currentLeads}
              </div>
            </div>
            <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--titan-blue)' }} />
            <div 
              className="flex-1 p-4 rounded-lg text-center border-2"
              style={{ 
                background: 'rgba(229, 193, 88, 0.1)',
                borderColor: 'var(--titan-blue)'
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-blue)' }}>
                Potential
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-blue)' }}>
                {Math.round(analysis.potentialLeads)}
              </div>
            </div>
          </div>
        </div>

        {/* Close Rate */}
        <div>
          <p className="text-sm mb-3 font-medium" style={{ color: 'var(--titan-text-primary)' }}>
            Close Rate
          </p>
          <div className="flex items-center gap-4">
            <div 
              className="flex-1 p-4 rounded-lg text-center"
              style={{ background: 'var(--titan-background)' }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-text-muted)' }}>
                Current
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
                {analysis.currentCloseRate}%
              </div>
            </div>
            <ArrowRight className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--titan-blue)' }} />
            <div 
              className="flex-1 p-4 rounded-lg text-center border-2"
              style={{ 
                background: 'rgba(229, 193, 88, 0.1)',
                borderColor: 'var(--titan-blue)'
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--titan-blue)' }}>
                Potential
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--titan-blue)' }}>
                {analysis.potentialCloseRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="mt-6 p-4 rounded-lg"
        style={{ background: 'rgba(229, 193, 88, 0.1)' }}
      >
        <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
          💡 <strong style={{ color: 'var(--titan-blue)' }}>The Bottom Line:</strong> By fixing your biggest gaps, you could{" "}
          <span style={{ color: 'var(--titan-blue)', fontWeight: 600 }}>
            2-3x your current revenue
          </span>{" "}
          in the next 90-180 days. The playbooks below show you exactly how.
        </p>
      </div>
    </div>
  );
}
