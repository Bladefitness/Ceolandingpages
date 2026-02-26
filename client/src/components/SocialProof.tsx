import { Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  selectedOption: string;
  questionType: string;
}

export function SocialProof({ selectedOption, questionType }: Props) {
  const [show, setShow] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Generate realistic percentage based on option (simulated social proof)
  const getPercentage = () => {
    // Use hash of option to generate consistent but varied percentages
    const hash = selectedOption.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 45 + (hash % 35); // Range: 45-80%
  };

  useEffect(() => {
    setShow(false);
    const timer = setTimeout(() => {
      setShow(true);
      setPercentage(getPercentage());
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedOption]);

  if (!show) return null;

  return (
    <div 
      className="mt-4 p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ 
        background: 'rgba(229, 193, 88, 0.05)',
        borderColor: 'rgba(229, 193, 88, 0.3)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: 'rgba(229, 193, 88, 0.2)' }}
        >
          <Users className="w-5 h-5" style={{ color: 'var(--titan-blue)' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--titan-blue)' }}>
            {percentage}% of practices chose this
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--titan-text-muted)' }}>
            Based on 2,000+ completed assessments
          </p>
        </div>
      </div>
    </div>
  );
}

export function LiveActivityFeed() {
  const [currentActivity, setCurrentActivity] = useState(0);

  const activities = [
    { name: "Sarah M.", location: "Denver", action: "completed", time: "2 minutes ago" },
    { name: "Michael R.", location: "Austin", action: "completed", time: "5 minutes ago" },
    { name: "Jennifer L.", location: "Miami", action: "started", time: "7 minutes ago" },
    { name: "David K.", location: "Seattle", action: "completed", time: "12 minutes ago" },
    { name: "Amanda P.", location: "Boston", action: "completed", time: "18 minutes ago" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <div 
      className="fixed bottom-6 left-6 p-4 rounded-lg border shadow-lg animate-in slide-in-from-left duration-500 max-w-xs z-40"
      style={{ 
        background: 'var(--titan-white)',
        borderColor: 'var(--titan-blue)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: '#4ade80' }}
        />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--titan-text-primary)' }}>
            <strong style={{ color: 'var(--titan-blue)' }}>{activity.name}</strong> from {activity.location}
          </p>
          <p className="text-xs" style={{ color: 'var(--titan-text-muted)' }}>
            {activity.action} their roadmap • {activity.time}
          </p>
        </div>
      </div>
    </div>
  );
}
