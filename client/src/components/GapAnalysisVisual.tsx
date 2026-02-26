import { ArrowRight, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';

interface GapAnalysisVisualProps {
  currentRevenue: string;
  currentLeads: number;
  currentCloseRate: number;
  potentialRevenue: string;
  potentialLeads: number;
  potentialCloseRate: number;
}

export function GapAnalysisVisual({
  currentRevenue,
  currentLeads,
  currentCloseRate,
  potentialRevenue,
  potentialLeads,
  potentialCloseRate,
}: GapAnalysisVisualProps) {
  const MetricCard = ({ 
    label, 
    current, 
    potential, 
    unit = '' 
  }: { 
    label: string; 
    current: string | number; 
    potential: string | number; 
    unit?: string;
  }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <div className="text-sm font-medium text-gray-600 mb-3">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {typeof current === 'number' ? (
              <><CountUp end={current} duration={1.5} separator="" decimals={0} />{unit}</>
            ) : (
              <>{current}{unit}</>
            )}
          </div>
        </div>

        <ArrowRight className="text-blue-500 flex-shrink-0" size={24} />

        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Potential</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {typeof potential === 'number' ? (
              <><CountUp end={potential} duration={1.5} separator="" decimals={0} />{unit}</>
            ) : (
              <>{potential}{unit}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-green-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          Your Growth Potential (18 Months)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Monthly Revenue"
          current={currentRevenue}
          potential={potentialRevenue}
        />
        
        <MetricCard
          label="Monthly Leads"
          current={currentLeads}
          potential={potentialLeads}
        />
        
        <MetricCard
          label="Close Rate"
          current={currentCloseRate}
          potential={potentialCloseRate}
          unit="%"
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-green-800">
          <span className="font-semibold">Based on your current scores,</span> implementing the recommended 
          systems could increase your revenue by <span className="font-bold">{
            calculateGrowthPercentage(currentRevenue, potentialRevenue)
          }%</span> within 18 months.
        </p>
      </div>
    </div>
  );
}

function calculateGrowthPercentage(current: string, potential: string): number {
  // Extract numeric values from revenue strings like "$20K-$50K"
  const extractMidpoint = (range: string): number => {
    const numbers = range.match(/\d+/g);
    if (!numbers || numbers.length === 0) return 0;
    if (numbers.length === 1) return parseInt(numbers[0]);
    return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
  };

  const currentVal = extractMidpoint(current);
  const potentialVal = extractMidpoint(potential);
  
  if (currentVal === 0) return 0;
  return Math.round(((potentialVal - currentVal) / currentVal) * 100);
}
