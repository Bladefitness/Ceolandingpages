import { CheckCircle2, Clock, AlertTriangle, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Helper function to ensure a value is an array
const ensureArray = <T,>(value: any): T[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return [value];
  return [];
};

interface PlaybookSnapshot {
  title?: string;
  diagnosis: string;
  pattern: string;
}

interface BenchmarkMetric {
  label: string;
  value: string;
  context?: string;
  note?: string;
}

interface Benchmarks {
  title: string;
  metrics: BenchmarkMetric[];
  opportunity?: string;
  calculation?: string;
}

interface WeeklyTask {
  dayRange?: string;
  title: string;
  tasks?: string[];
  description?: string;
  script?: string[];
  tracking?: string;
  examples?: string[];
}

interface WeeklyPlan {
  week: number;
  title: string;
  description?: string;
  days?: WeeklyTask[];
  sections?: WeeklyTask[];
  campaignSetup?: any;
  monitoring?: any;
  actions?: string[];
}

interface SuccessMetric {
  metric: string;
  target: string;
}

interface Warning {
  title: string;
  reason: string;
}

interface Milestone {
  timeframe: string;
  goal: string;
  successSignals: string[];
  nextStep: string;
}

interface VisualPlaybookProps {
  data: {
    snapshot: PlaybookSnapshot;
    benchmarks: Benchmarks;
    weeklyPlan: WeeklyPlan[];
    successMetrics: SuccessMetric[];
    warnings: Warning[];
    milestone: Milestone;
  };
  roadmapId: number;
  playbookType: "offer" | "facebook" | "instagram" | "leadgen";
  completedTasks: string[];
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export function VisualPlaybook({ data, roadmapId, playbookType, completedTasks, onToggleTask }: VisualPlaybookProps) {
  return (
    <div className="space-y-8">
      {/* Snapshot Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {data.snapshot.title || 'Your Current State'}
            </h3>
            <p className="text-gray-700 mb-3">{data.snapshot.diagnosis}</p>
            <p className="text-sm text-gray-600 italic">
              <strong>The Pattern:</strong> {data.snapshot.pattern}
            </p>
          </div>
        </div>
      </Card>

      {/* Benchmarks Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          {data.benchmarks.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {ensureArray<BenchmarkMetric>(data.benchmarks?.metrics).map((metric, idx) => (
            <Card key={idx} className="p-4 bg-white border-gray-200">
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{metric.value}</div>
              {(metric.context || metric.note) && (
                <div className="text-xs text-gray-500">{metric.context || metric.note}</div>
              )}
            </Card>
          ))}
        </div>
        {(data.benchmarks.opportunity || data.benchmarks.calculation) && (
          <Card className="p-4 bg-green-50 border-green-200">
            <p className="text-sm text-green-800 font-medium">
              {data.benchmarks.opportunity || data.benchmarks.calculation}
            </p>
          </Card>
        )}
      </div>

      {/* Weekly Plan Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Your Action Plan
        </h3>
        <div className="space-y-6">
          {ensureArray<WeeklyPlan>(data.weeklyPlan).map((week, weekIdx) => (
            <Card key={weekIdx} className="p-6 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  W{week.week}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{week.title}</h4>
                  {week.description && (
                    <p className="text-sm text-gray-600">{week.description}</p>
                  )}
                </div>
              </div>

              {/* Days/Sections */}
              {(week.days || week.sections)?.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-4 last:mb-0 pl-4 border-l-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    {section.dayRange && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Day {section.dayRange}
                      </span>
                    )}
                    <h5 className="font-semibold text-gray-900">{section.title}</h5>
                  </div>
                  {section.tasks && (
                    <ul className="space-y-1 ml-2">
                      {section.tasks.map((task, taskIdx) => {
                        const taskId = `week${week.week}_section${sectionIdx}_task${taskIdx}`;
                        const isCompleted = completedTasks?.includes(taskId) || false;
                        
                        return (
                          <li key={taskIdx} className="flex items-start gap-2 text-sm group">
                            <button
                              onClick={() => onToggleTask(taskId, !isCompleted)}
                              className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                              aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full group-hover:border-green-500" />
                              )}
                            </button>
                            <span className={isCompleted ? "text-gray-500 line-through" : "text-gray-700"}>{task}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {section.examples && (
                    <ul className="space-y-1 ml-2 mt-2">
                      {section.examples.map((example, exIdx) => (
                        <li key={exIdx} className="text-sm text-gray-600 italic">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Campaign Setup */}
              {week.campaignSetup && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Campaign Setup</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(week.campaignSetup).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700">{key}: </span>
                        <span className="text-gray-600">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {week.actions && (
                <ul className="space-y-2 mt-4">
                  {week.actions.map((action, actionIdx) => {
                    const taskId = `week${week.week}_action${actionIdx}`;
                    const isCompleted = completedTasks?.includes(taskId) || false;
                    
                    return (
                      <li key={actionIdx} className="flex items-start gap-2 text-sm group">
                        <button
                          onClick={() => onToggleTask(taskId, !isCompleted)}
                          className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-400 rounded-full group-hover:border-blue-500" />
                          )}
                        </button>
                        <span className={isCompleted ? "text-gray-500 line-through" : "text-gray-700"}>{action}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Success Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ensureArray<SuccessMetric>(data.successMetrics).map((metric, idx) => (
            <Card key={idx} className="p-4 bg-green-50 border-green-200">
              <div className="text-sm text-gray-700 mb-2">{metric.metric}</div>
              <div className="text-2xl font-bold text-green-600">{metric.target}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Warnings */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Critical Warnings
        </h3>
        <div className="space-y-3">
          {ensureArray<Warning>(data.warnings).map((warning, idx) => (
            <Card key={idx} className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">{warning.title}</h5>
                  <p className="text-sm text-gray-700">{warning.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestone */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{data.milestone.timeframe} Goal</h3>
            </div>
            <p className="text-gray-800 font-medium mb-3">{data.milestone.goal}</p>
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">You'll know it's working when:</p>
              <ul className="space-y-1">
                {ensureArray<string>(data.milestone?.successSignals).map((signal, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">
              <strong>Next Step:</strong> {data.milestone.nextStep}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
