import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPerformers: number;
}

interface BenchmarkComparisonChartProps {
  data: BenchmarkData[];
}

export function BenchmarkComparisonChart({ data }: BenchmarkComparisonChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="category"
            tick={{ fill: '#374151', fontSize: 11 }}
            angle={0}
            height={40}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="yourScore" 
            name="Your Score" 
            fill="#3B82F6" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="industryAverage" 
            name="Industry Average" 
            fill="#94A3B8" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="topPerformers" 
            name="Top Performers" 
            fill="#10B981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
