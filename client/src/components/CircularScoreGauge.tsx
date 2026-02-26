import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

interface CircularScoreGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export function CircularScoreGauge({ score, label = "Overall Score", size = 'large' }: CircularScoreGaugeProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10B981'; // Green - Excellent
    if (score >= 60) return '#3B82F6'; // Blue - Good
    if (score >= 40) return '#F59E0B'; // Orange - Fair
    return '#EF4444'; // Red - Needs Work
  };

  // Determine size dimensions
  const sizeMap = {
    small: { width: 120, height: 120, fontSize: '24px', labelSize: '12px' },
    medium: { width: 180, height: 180, fontSize: '36px', labelSize: '14px' },
    large: { width: 200, height: 200, fontSize: '40px', labelSize: '16px' },
  };

  const dimensions = sizeMap[size];
  const scoreColor = getScoreColor(score);

  // Data for the pie chart (score vs remaining)
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: dimensions.width, height: dimensions.height }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={scoreColor} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            style={{ 
              fontSize: dimensions.fontSize,
              color: scoreColor,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            <CountUp 
              end={score} 
              duration={1.5} 
              separator="" 
              decimals={0}
            />
          </div>
          <div 
            style={{ 
              fontSize: dimensions.labelSize,
              color: '#6B7280',
              marginTop: '4px',
            }}
          >
            out of 100
          </div>
        </div>
      </div>
      
      <div 
        className="mt-4 text-center font-semibold"
        style={{ 
          fontSize: dimensions.labelSize,
          color: '#1F2937',
        }}
      >
        {label}
      </div>
    </div>
  );
}
