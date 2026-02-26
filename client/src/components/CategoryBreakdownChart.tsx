import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryScore {
  category: string;
  score: number;
  color: string;
  gradient: string;
  explanation: string;
}

interface CategoryBreakdownChartProps {
  leadGeneration: number;
  offerClarity: number;
  socialPresence: number;
  conversionProcess: number;
}

export function CategoryBreakdownChart({ 
  leadGeneration, 
  offerClarity, 
  socialPresence, 
  conversionProcess 
}: CategoryBreakdownChartProps) {
  const categories: CategoryScore[] = [
    { 
      category: 'Lead Generation', 
      score: leadGeneration, 
      color: '#06B6D4',
      gradient: 'from-cyan-500 to-cyan-400',
      explanation: 'Based on: ad budget, lead response speed, missed lead percentage, and CRM usage. Higher scores indicate strong lead capture systems.'
    },
    { 
      category: 'Offer Clarity', 
      score: offerClarity, 
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-400',
      explanation: 'Based on: offer confidence level, pricing clarity, and differentiation from competitors. Higher scores mean your offer is clear and compelling.'
    },
    { 
      category: 'Social Presence', 
      score: socialPresence, 
      color: '#10B981',
      gradient: 'from-green-500 to-green-400',
      explanation: 'Based on: content frequency, audience size, and engagement quality. Higher scores indicate strong brand visibility and trust.'
    },
    { 
      category: 'Conversion Process', 
      score: conversionProcess, 
      color: '#F59E0B',
      gradient: 'from-amber-500 to-amber-400',
      explanation: 'Based on: lead nurturing system, follow-up automation, and sales process efficiency. Higher scores mean you convert leads effectively.'
    },
  ];

  return (
    <div className="w-full space-y-4">
      {categories.map((item, index) => (
        <div 
          key={index}
          className="relative bg-[#1A1F2E] rounded-2xl p-4 sm:p-6 shadow-lg"
          style={{ borderLeft: `4px solid ${item.color}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-bold text-white">
                  {item.score}
                </span>
                <span className="text-lg sm:text-2xl text-gray-400 font-medium">
                  /100
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base sm:text-lg text-gray-300 font-medium">
                  {item.category}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-200 transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 p-3">
                      <p className="text-sm">{item.explanation}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`}
              style={{ width: `${item.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
