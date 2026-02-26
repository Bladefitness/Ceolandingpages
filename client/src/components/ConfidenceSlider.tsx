import { useState } from "react";
import { Frown, Meh, Smile } from "lucide-react";

interface Props {
  question: string;
  value: number;
  onChange: (value: number) => void;
}

export function ConfidenceSlider({ question, value, onChange }: Props) {
  const [localValue, setLocalValue] = useState(value || 50);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getEmoji = () => {
    if (localValue < 33) return <Frown className="w-8 h-8" style={{ color: '#ef4444' }} />;
    if (localValue < 67) return <Meh className="w-8 h-8" style={{ color: 'var(--titan-blue)' }} />;
    return <Smile className="w-8 h-8" style={{ color: '#4ade80' }} />;
  };

  const getLabel = () => {
    if (localValue < 33) return "Not confident";
    if (localValue < 67) return "Somewhat confident";
    return "Very confident";
  };

  const getColor = () => {
    if (localValue < 33) return '#ef4444';
    if (localValue < 67) return 'var(--titan-blue)';
    return '#4ade80';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--titan-text-primary)' }}>
          {question}
        </h2>
        <p className="text-sm" style={{ color: 'var(--titan-text-muted)' }}>
          Slide to indicate your confidence level
        </p>
      </div>

      {/* Emoji Indicator */}
      <div className="flex justify-center">
        <div 
          className="transition-all duration-300"
          style={{ transform: `scale(${1 + (localValue / 200)})` }}
        >
          {getEmoji()}
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={localValue}
          onChange={handleChange}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #ef4444 0%, 
              var(--titan-blue) 50%, 
              #4ade80 100%)`,
          }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 pointer-events-none transition-all duration-200"
          style={{
            left: `calc(${localValue}% - 12px)`,
            background: getColor(),
            borderColor: 'var(--titan-background)',
            boxShadow: `0 0 12px ${getColor()}`
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs" style={{ color: 'var(--titan-text-muted)' }}>
        <span>Not confident</span>
        <span 
          className="font-semibold text-base transition-all duration-300"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </span>
        <span>Very confident</span>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
        }
        input[type="range"]::-moz-range-thumb {
          width: 0;
          height: 0;
          border: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
