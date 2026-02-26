import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPerformers: number;
}

interface Props {
  data: BenchmarkData[];
}

export function BenchmarkChart({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.category),
        datasets: [
          {
            label: "Your Score",
            data: data.map((d) => d.yourScore),
            backgroundColor: "#E5C158",
            borderColor: "#E5C158",
            borderWidth: 2,
          },
          {
            label: "Industry Average",
            data: data.map((d) => d.industryAverage),
            backgroundColor: "rgba(156, 163, 175, 0.5)",
            borderColor: "#9ca3af",
            borderWidth: 1,
          },
          {
            label: "Top Performers",
            data: data.map((d) => d.topPerformers),
            backgroundColor: "rgba(74, 222, 128, 0.5)",
            borderColor: "#4ade80",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#9ca3af",
              font: {
                size: 12,
              },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "#1a1a1a",
            titleColor: "#ffffff",
            bodyColor: "#9ca3af",
            borderColor: "#E5C158",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context: any) {
                return `${context.dataset.label}: ${context.parsed.y}/100`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
              callback: function (value: any) {
                return value + "";
              },
            },
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div 
      className="p-6 sm:p-8 rounded-lg"
      style={{ background: 'var(--titan-white)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold" style={{ color: 'var(--titan-text-primary)' }}>
          How You Compare
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center">
              <Info className="w-4 h-4" style={{ color: 'var(--titan-blue)' }} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-sm">
              <strong>Your Score:</strong> Based on your quiz responses.<br/>
              <strong>Industry Average:</strong> Median scores from 2,000+ health practices ($20K-$90K/month).<br/>
              <strong>Top Performers:</strong> 90th percentile scores from practices scaling past $100K/month.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--titan-text-muted)' }}>
        Your scores vs. industry benchmarks
      </p>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
