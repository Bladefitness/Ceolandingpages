import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Target, Zap } from "lucide-react";

interface TitanRoadmapData {
  diagnosis: {
    snapshot: string;
    primaryConstraint: string;
    costOfInaction: string;
  };
  titanPhase: {
    phase: string;
    mission: string;
    whyNow: string;
    victoryCondition: string;
  };
  benchmarks: Array<{
    metric: string;
    value: string;
    context: string;
  }>;
  actionPlan: {
    primaryBuild: {
      title: string;
      description: string;
      components: string[];
      doneDefinition: string;
      estimatedEffort: string;
    };
    weeklyPlan: Array<{
      week: number;
      title: string;
      days: Array<{
        dayRange: string;
        task: string;
        details: string[];
      }>;
    }>;
    blitz72Hours: Array<{
      task: string;
      why: string;
    }>;
  };
  warnings: Array<{
    title: string;
    reason: string;
  }>;
  milestone: {
    timeframe: string;
    goal: string;
    successSignals: string[];
    nextStep: string;
  };
  titanPath: {
    currentPhase: string;
    nextPhases: string[];
    estimatedTimeToSovereign: string;
  };
}

interface VisualTitanRoadmapProps {
  data: TitanRoadmapData;
  roadmapId: number;
  completedTasks: string[];
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export function VisualTitanRoadmap({ data, roadmapId, completedTasks, onToggleTask }: VisualTitanRoadmapProps) {
  return (
    <div className="space-y-6">
      {/* Diagnosis Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start gap-3 mb-4">
          <Target className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Your Current State</h3>
            <p className="text-blue-800 leading-relaxed">{data.diagnosis.snapshot}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-300">
          <p className="text-sm font-semibold text-blue-900 mb-1">Primary Constraint:</p>
          <p className="text-blue-800">{data.diagnosis.primaryConstraint}</p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-blue-300">
          <p className="text-sm font-semibold text-blue-900 mb-1">Cost of Inaction:</p>
          <p className="text-blue-800">{data.diagnosis.costOfInaction}</p>
        </div>
      </Card>

      {/* Titan Phase Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="text-purple-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">{data.titanPhase.phase}</h3>
            <p className="text-lg font-semibold text-purple-800 mb-3">{data.titanPhase.mission}</p>
            <p className="text-purple-800 leading-relaxed mb-3">{data.titanPhase.whyNow}</p>
            <div className="bg-white/50 rounded-lg p-3 mt-3">
              <p className="text-sm font-semibold text-purple-900 mb-1">Victory Condition:</p>
              <p className="text-purple-800">{data.titanPhase.victoryCondition}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Industry Benchmarks */}
      {data.benchmarks && data.benchmarks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Benchmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.benchmarks.map((benchmark, index) => (
              <Card key={index} className="p-4 bg-white border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">{benchmark.metric}</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">{benchmark.value}</p>
                <p className="text-sm text-gray-600">{benchmark.context}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Primary Build */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <Zap className="text-blue-600 flex-shrink-0" size={24} />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{data.actionPlan.primaryBuild.title}</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{data.actionPlan.primaryBuild.description}</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">System Components:</p>
              <ul className="space-y-2">
                {data.actionPlan.primaryBuild.components.map((component, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-sm text-gray-700">{component}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-gray-500" size={16} />
                <span className="text-gray-600">Estimated Effort: <strong>{data.actionPlan.primaryBuild.estimatedEffort}</strong></span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-1">Done Definition:</p>
              <p className="text-gray-700">{data.actionPlan.primaryBuild.doneDefinition}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 72-Hour Blitz */}
      {data.actionPlan.blitz72Hours && data.actionPlan.blitz72Hours.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start gap-3 mb-4">
            <Zap className="text-orange-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-3">72-Hour Blitz Tasks</h3>
              <p className="text-sm text-orange-700 mb-4">Start here for immediate impact</p>
              <div className="space-y-3">
                {data.actionPlan.blitz72Hours.map((task, index) => (
                  <div key={index} className="bg-white/70 rounded-lg p-4">
                    <p className="font-semibold text-orange-900 mb-2">{task.task}</p>
                    <p className="text-sm text-orange-800">{task.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Action Plan */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Action Plan</h3>
        <div className="space-y-6">
          {data.actionPlan.weeklyPlan.map((week) => (
            <Card key={week.week} className="p-6 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  W{week.week}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{week.title}</h4>
              </div>
              
              <div className="space-y-4">
                {week.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-600">{day.dayRange}</span>
                      <span className="text-sm font-semibold text-gray-900">{day.task}</span>
                    </div>
                    <ul className="space-y-1.5 ml-4">
                      {day.details.map((detail, detailIndex) => {
                        const taskId = `week${week.week}_${day.dayRange.replace(/\s+/g, '_')}_task${detailIndex}`;
                        const isCompleted = completedTasks?.includes(taskId) || false;
                        
                        return (
                          <li key={detailIndex} className="flex items-start gap-2 group">
                            <button
                              onClick={() => onToggleTask(taskId, !isCompleted)}
                              className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                              aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="text-green-600" size={14} />
                              ) : (
                                <div className="w-3.5 h-3.5 border-2 border-gray-400 rounded-full group-hover:border-green-500" />
                              )}
                            </button>
                            <span className={`text-sm ${
                              isCompleted ? "text-gray-500 line-through" : "text-gray-700"
                            }`}>{detail}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Critical Warnings</h3>
          <div className="space-y-3">
            {data.warnings.map((warning, index) => (
              <Card key={index} className="p-4 bg-orange-50 border-orange-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-orange-900 mb-1">{warning.title}</p>
                    <p className="text-sm text-orange-800">{warning.reason}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Milestone */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-start gap-3">
          <Target className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-2">{data.milestone.timeframe} Goal</h3>
            <p className="text-lg font-semibold text-green-800 mb-4">{data.milestone.goal}</p>
            
            <div className="bg-white/70 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-green-900 mb-2">Success Signals:</p>
              <ul className="space-y-2">
                {data.milestone.successSignals.map((signal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-sm text-green-800">{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-3 border-t border-green-300">
              <p className="text-sm font-semibold text-green-900 mb-1">Next Step:</p>
              <p className="text-green-800">{data.milestone.nextStep}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Titan Path */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-gray-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Titan Path</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  {data.titanPath.currentPhase}
                </span>
                <span className="text-gray-400">→</span>
              </div>
              {data.titanPath.nextPhases.map((phase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                    {phase}
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                Sovereign Owner
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Estimated time to Sovereign Owner: <strong>{data.titanPath.estimatedTimeToSovereign}</strong>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
