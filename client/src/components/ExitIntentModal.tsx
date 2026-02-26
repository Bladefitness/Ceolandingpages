import { useState, useEffect } from "react";
import { X, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onContinue: () => void;
  progressPercent: number;
  questionsLeft: number;
}

export function ExitIntentModal({ onContinue, progressPercent, questionsLeft }: Props) {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of screen and quiz is not complete
      if (e.clientY <= 0 && progressPercent < 100 && progressPercent > 10) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [progressPercent]);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [show, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    setShow(false);
    onContinue();
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={() => setShow(false)}
    >
      <div 
        className="relative max-w-lg w-full p-8 rounded-2xl border-2 animate-in fade-in zoom-in duration-300"
        style={{ 
          background: 'var(--titan-white)',
          borderColor: 'var(--titan-blue)',
          boxShadow: '0 20px 60px rgba(229, 193, 88, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
          style={{ 
            background: 'var(--titan-background)',
            color: 'var(--titan-text-muted)'
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2"
            style={{ background: 'rgba(229, 193, 88, 0.2)' }}
          >
            <TrendingUp className="w-8 h-8" style={{ color: 'var(--titan-blue)' }} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--titan-text-primary)' }}>
              Wait! You're {progressPercent}% Done
            </h2>
            <p className="text-lg mb-4" style={{ color: 'var(--titan-text-primary)' }}>
              You're only <strong style={{ color: 'var(--titan-blue)' }}>{questionsLeft} questions away</strong> from discovering your biggest growth bottleneck.
            </p>
          </div>

          {/* Sample Preview */}
          <div 
            className="p-6 rounded-lg text-left border"
            style={{ 
              background: 'var(--titan-background)',
              borderColor: 'var(--titan-border)'
            }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--titan-text-muted)' }}>
              Here's what you'll get:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--titan-blue)' }}>✓</span>
                <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
                  Your personalized <strong>Business Health Score</strong> (0-100)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--titan-blue)' }}>✓</span>
                <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
                  Exact bottleneck diagnosis with <strong>industry benchmarks</strong>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--titan-blue)' }}>✓</span>
                <p className="text-sm" style={{ color: 'var(--titan-text-primary)' }}>
                  Custom growth roadmap worth <strong>$2,500</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div 
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <Clock className="w-4 h-4" style={{ color: '#ef4444' }} />
            <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
              This window closes in {formatTime(countdown)}
            </p>
          </div>

          {/* CTA */}
          <Button
            onClick={handleContinue}
            className="w-full text-lg py-6"
            style={{ 
              background: 'var(--titan-blue)',
              color: 'var(--titan-background)'
            }}
          >
            Complete My Roadmap ({questionsLeft} questions left)
          </Button>

          <p className="text-xs" style={{ color: 'var(--titan-text-muted)' }}>
            5,000+ health professionals have already completed this
          </p>
        </div>
      </div>
    </div>
  );
}
