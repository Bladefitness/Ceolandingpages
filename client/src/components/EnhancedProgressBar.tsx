import { Trophy, Star, Target, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  progressPercent: number;
  questionNumber: number;
  totalQuestions: number;
}

export function EnhancedProgressBar({ progressPercent, questionNumber, totalQuestions }: Props) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Animate percentage counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  const getMilestone = () => {
    if (progressPercent >= 100) return { icon: <Sparkles className="w-5 h-5" />, text: "Complete! Generating your roadmap...", color: "var(--titan-blue)" };
    if (progressPercent >= 75) return { icon: <Trophy className="w-5 h-5" />, text: "Almost there! Your custom strategy is ready...", color: "var(--titan-blue)" };
    if (progressPercent >= 50) return { icon: <Target className="w-5 h-5" />, text: "Halfway! Your bottleneck analysis unlocked", color: "var(--titan-blue)" };
    if (progressPercent >= 25) return { icon: <Star className="w-5 h-5" />, text: "Great start! Keep going...", color: "var(--titan-blue)" };
    return { icon: <Target className="w-5 h-5" />, text: "Let's find your growth bottleneck", color: "var(--titan-text-muted)" };
  };

  const milestone = getMilestone();
  const questionsLeft = totalQuestions - questionNumber;

  return (
    <div className="mb-8 sticky top-0 z-50 py-4 -mx-4 px-4" style={{ background: 'var(--titan-background)' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <p style={{ fontSize: 'var(--titan-size-body-sm)', color: 'var(--titan-text-muted)' }}>
            Question {questionNumber} of {totalQuestions}
          </p>
          {questionsLeft > 0 && questionsLeft <= 3 && (
            <span 
              className="px-2 py-1 rounded-full text-xs font-semibold animate-pulse"
              style={{ 
                background: 'rgba(229, 193, 88, 0.2)',
                color: 'var(--titan-blue)'
              }}
            >
              Only {questionsLeft} left!
            </span>
          )}
        </div>
        <p 
          className="text-lg font-bold transition-all duration-500"
          style={{ color: 'var(--titan-blue)' }}
        >
          {animatedPercent}%
        </p>
      </div>

      {/* Progress Bar with Milestone Markers */}
      <div className="relative">
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--titan-white)' }}>
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ 
              background: 'linear-gradient(90deg, var(--titan-blue) 0%, #f4d88a 100%)',
              width: `${animatedPercent}%`,
              boxShadow: animatedPercent > 0 ? '0 0 10px rgba(229, 193, 88, 0.5)' : 'none'
            }}
          >
            {/* Animated shimmer effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 2s infinite'
              }}
            />
          </div>
        </div>

        {/* Milestone Markers */}
        <div className="absolute top-0 left-0 w-full h-3">
          {[25, 50, 75, 100].map((milestone) => {
            const isUnlocked = progressPercent >= milestone;
            return (
              <div
                key={milestone}
                className="absolute transition-all duration-300"
                style={{ 
                  left: `${milestone}%`,
                  top: '0',
                  transform: 'translate(-50%, 0)'
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                  style={{
                    background: isUnlocked ? 'var(--titan-blue)' : 'var(--titan-white)',
                    borderColor: isUnlocked ? 'var(--titan-blue)' : 'var(--titan-border)',
                    transform: isUnlocked ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isUnlocked ? '0 0 8px rgba(229, 193, 88, 0.6)' : 'none'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Message */}
      <div className="flex items-center gap-2 mt-3">
        <div style={{ color: milestone.color }}>
          {milestone.icon}
        </div>
        <p 
          className="text-sm font-medium transition-all duration-300"
          style={{ color: milestone.color }}
        >
          {milestone.text}
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
