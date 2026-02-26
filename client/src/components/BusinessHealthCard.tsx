import { TrendingUp, TrendingDown, Target, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import CountUp from 'react-countup';

interface BusinessHealthScore {
  overall: number;
  leadGeneration: number;
  offerClarity: number;
  socialPresence: number;
  conversionProcess: number;
  topStrength: string;
  biggestGap: string;
}

interface Props {
  scores: BusinessHealthScore;
}

export function BusinessHealthCard({ scores }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "#4ade80"; // Green
    if (score >= 50) return "#E5C158"; // Gold
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong";
    if (score >= 50) return "Moderate";
    return "Needs Work";
  };

  const getCategoryTooltip = (categoryName: string) => {
    const tooltips: Record<string, string> = {
      "Lead Generation": "Measures your ability to attract and capture new leads. Based on your lead volume, response time, follow-up systems, and CRM usage. Industry average: 55/100.",
      "Offer Clarity": "Evaluates how well-defined and compelling your service offering is. Based on your unique differentiators, pricing strategy, and value proposition. Industry average: 60/100.",
      "Social Presence": "Assesses your visibility and engagement on social media platforms. Based on content frequency, follower count, and platform strategy. Industry average: 50/100.",
      "Conversion Process": "Analyzes your ability to convert leads into paying clients. Based on close rate, sales process, and consultation effectiveness. Industry average: 58/100."
    };
    return tooltips[categoryName] || "";
  };

  const categories = [
    { name: "Lead Generation", score: scores.leadGeneration, icon: "📊" },
    { name: "Offer Clarity", score: scores.offerClarity, icon: "💰" },
    { name: "Social Presence", score: scores.socialPresence, icon: "📱" },
    { name: "Conversion Process", score: scores.conversionProcess, icon: "🎯" },
  ];

  return (
    <div 
      className="p-6 sm:p-8 rounded-lg border"
      style={{ 
        background: 'var(--titan-white)',
        borderColor: 'var(--titan-blue)'
      }}
    >
      {/* Overall Score Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
          style={{ 
            background: `conic-gradient(${getScoreColor(scores.overall)} ${scores.overall * 3.6}deg, var(--titan-background) 0deg)`,
            border: '8px solid var(--titan-background)'
          }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: 'var(--titan-white)', margin: '8px' }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: getScoreColor(scores.overall) }}>
                <CountUp end={scores.overall} duration={1.5} separator="" decimals={0} />
              </div>
              <div className="text-xs" style={{ color: 'var(--titan-text-muted)' }}>
                / 100
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
            Your Business Health Score
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="inline-flex items-center justify-center">
                <Info className="w-5 h-5" style={{ color: 'var(--titan-blue)' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">
                Your overall score (0-100) is calculated from 4 key areas: Lead Generation (25pts), Offer Clarity (25pts), Social Presence (25pts), and Conversion Process (25pts). Higher scores indicate stronger business fundamentals.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm" style={{ color: 'var(--titan-text-muted)' }}>
          {getScoreLabel(scores.overall)} - {scores.overall >= 70 ? "You're ahead of most" : scores.overall >= 50 ? "Room for improvement" : "Major opportunities ahead"}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 mb-6">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.icon}</span>
                <span className="font-medium" style={{ color: 'var(--titan-text-primary)' }}>
                  {cat.name}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center">
                      <Info className="w-4 h-4" style={{ color: 'var(--titan-text-muted)' }} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">
                      {getCategoryTooltip(cat.name)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: getScoreColor(cat.score) }}>
                  <CountUp end={cat.score} duration={1.5} separator="" decimals={0} />
                </span>
                <span className="text-sm" style={{ color: 'var(--titan-text-muted)' }}>
                  / 100
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'var(--titan-background)' }}>
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  background: getScoreColor(cat.score),
                  width: `${cat.score}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top Strength & Biggest Gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            background: 'rgba(74, 222, 128, 0.1)',
            borderColor: '#4ade80'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#4ade80' }} />
            <span className="font-semibold" style={{ color: '#4ade80' }}>
              Top Strength
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
            {scores.topStrength}
          </p>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#ef4444'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" style={{ color: '#ef4444' }} />
            <span className="font-semibold" style={{ color: '#ef4444' }}>
              Biggest Gap
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
            {scores.biggestGap}
          </p>
        </div>
      </div>
    </div>
  );
}
