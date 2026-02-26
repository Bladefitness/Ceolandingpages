import { useState, useEffect } from "react";
import { useRoute, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2, Share2, TrendingUp, Award, AlertCircle } from "lucide-react";
import { Streamdown } from "streamdown";
import { VisualPlaybook } from "@/components/VisualPlaybook";
import { VisualTitanRoadmap } from "@/components/VisualTitanRoadmap";
import { SharePlaybookModal } from "@/components/SharePlaybookModal";
import { trpc } from "@/lib/trpc";
import { generatePDF } from "@/lib/pdfGenerator";
import { CircularScoreGauge } from "@/components/CircularScoreGauge";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { BenchmarkComparisonChart } from "@/components/BenchmarkComparisonChart";
import { GapAnalysisVisual } from "@/components/GapAnalysisVisual";
import { SkoolBanner } from "@/components/SkoolBanner";

type PlaybookType = "titan" | "offer" | "facebook" | "instagram" | "leadgen";

export default function Dashboard() {
  const [, params] = useRoute("/dashboard/:id");
  const roadmapId = params?.id ? parseInt(params.id) : null;

  const [activePlaybook, setActivePlaybook] = useState<PlaybookType>("titan");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showBookingBanner, setShowBookingBanner] = useState(true);

  // Fetch roadmap from backend
  const { data: roadmap, isLoading, error } = trpc.roadmap.getRoadmap.useQuery(
    { id: roadmapId! },
    { enabled: !!roadmapId }
  );

  // Fetch completed tasks for active playbook
  const { data: completedTasks = [], refetch: refetchProgress } = trpc.progress.getProgress.useQuery(
    {
      roadmapId: roadmapId!,
      playbookType: activePlaybook,
    },
    { enabled: !!roadmapId }
  );

  // Task toggle mutation
  const toggleTaskMutation = trpc.progress.toggleTask.useMutation({
    onSuccess: () => {
      refetchProgress();
    },
  });

  const handleToggleTask = (taskId: string, completed: boolean) => {
    toggleTaskMutation.mutate({
      roadmapId: roadmapId!,
      playbookType: activePlaybook,
      taskId,
      completed,
    });
  };

  // Auto-download PDF when linked from email
  const searchString = useSearch();

  useEffect(() => {
    if (new URLSearchParams(searchString).get('download') === 'pdf' && roadmap && !isLoading) {
      const timer = setTimeout(async () => {
        try {
          const overallScore = roadmap.overallScore || 0;
          const operationsScore = roadmap.operationsScore || 0;
          const marketingScore = roadmap.marketingScore || 0;
          const salesScore = roadmap.salesScore || 0;
          const systemsScore = roadmap.systemsScore || 0;

          const pdfData = {
            ...roadmap,
            businessHealthScores: {
              overall: overallScore,
              leadGeneration: operationsScore,
              offerClarity: marketingScore,
              socialPresence: salesScore,
              conversionProcess: systemsScore,
              topStrength: operationsScore >= Math.max(marketingScore, salesScore, systemsScore) ? 'Lead Generation' :
                           marketingScore >= Math.max(operationsScore, salesScore, systemsScore) ? 'Offer Clarity' :
                           salesScore >= Math.max(operationsScore, marketingScore, systemsScore) ? 'Social Presence' : 'Conversion Process',
              biggestGap: operationsScore <= Math.min(marketingScore, salesScore, systemsScore) ? 'Lead Generation needs improvement' :
                          marketingScore <= Math.min(operationsScore, salesScore, systemsScore) ? 'Offer Clarity needs improvement' :
                          salesScore <= Math.min(operationsScore, marketingScore, systemsScore) ? 'Social Presence needs improvement' : 'Conversion Process needs improvement',
            },
            benchmarkData: [
              { category: 'Operations', yourScore: operationsScore, industryAverage: 55, topPerformers: 85 },
              { category: 'Marketing', yourScore: marketingScore, industryAverage: 45, topPerformers: 80 },
              { category: 'Sales', yourScore: salesScore, industryAverage: 50, topPerformers: 85 },
              { category: 'Systems', yourScore: systemsScore, industryAverage: 60, topPerformers: 90 },
            ],
            gapAnalysis: (() => {
              const revenue = roadmap.monthlyRevenue || "";
              const currentRevenue = revenue.includes("$100K+") ? "$100K+" :
                                    revenue.includes("$50K-$100K") ? "$50K-$100K" :
                                    revenue.includes("$20K-$50K") ? "$20K-$50K" :
                                    revenue.includes("$5K-$20K") ? "$5K-$20K" : "$0-$5K";
              const potentialMultiplier = overallScore >= 70 ? 2.5 : overallScore >= 50 ? 2.0 : 1.5;
              let potentialRevenue = "$20K-$40K";
              if (currentRevenue.includes("$100K+")) potentialRevenue = "$200K-$300K";
              else if (currentRevenue.includes("$50K-$100K")) potentialRevenue = "$125K-$200K";
              else if (currentRevenue.includes("$20K-$50K")) potentialRevenue = "$60K-$100K";
              else if (currentRevenue.includes("$5K-$20K")) potentialRevenue = "$30K-$50K";
              else potentialRevenue = "$10K-$20K";
              let currentLeads = 5;
              if (currentRevenue.includes("$100K+")) currentLeads = 50;
              else if (currentRevenue.includes("$50K-$100K")) currentLeads = 35;
              else if (currentRevenue.includes("$20K-$50K")) currentLeads = 20;
              else if (currentRevenue.includes("$5K-$20K")) currentLeads = 10;
              let currentCloseRate = 12;
              if (salesScore >= 70) currentCloseRate = 35;
              else if (salesScore >= 50) currentCloseRate = 25;
              else if (salesScore >= 30) currentCloseRate = 18;
              return {
                currentRevenue,
                currentLeads,
                currentCloseRate,
                potentialRevenue,
                potentialLeads: Math.round(currentLeads * potentialMultiplier),
                potentialCloseRate: Math.min(currentCloseRate + 15, 40),
              };
            })(),
          };
          await generatePDF(pdfData);
        } catch (err) {
          console.error('Auto PDF download failed:', err);
        }
        window.history.replaceState({}, '', window.location.pathname);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [roadmap, isLoading, searchString]);

  if (!roadmapId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Invalid roadmap ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Analyzing your business...
          </h2>
          <p className="text-gray-600">Calculating your personalized roadmap</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-gray-900">
            Roadmap not found
          </p>
          <Button onClick={() => window.location.href = '/quiz'}>
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare complete roadmap data with all required fields for PDF
      const pdfData = {
        ...roadmap,
        businessHealthScores: {
          overall: overallScore,
          leadGeneration: operationsScore,
          offerClarity: marketingScore,
          socialPresence: salesScore,
          conversionProcess: systemsScore,
          topStrength: operationsScore >= Math.max(marketingScore, salesScore, systemsScore) ? 'Lead Generation' :
                       marketingScore >= Math.max(operationsScore, salesScore, systemsScore) ? 'Offer Clarity' :
                       salesScore >= Math.max(operationsScore, marketingScore, systemsScore) ? 'Social Presence' : 'Conversion Process',
          biggestGap: operationsScore <= Math.min(marketingScore, salesScore, systemsScore) ? 'Lead Generation needs improvement' :
                      marketingScore <= Math.min(operationsScore, salesScore, systemsScore) ? 'Offer Clarity needs improvement' :
                      salesScore <= Math.min(operationsScore, marketingScore, systemsScore) ? 'Social Presence needs improvement' : 'Conversion Process needs improvement',
        },
        benchmarkData,
        gapAnalysis: gapAnalysisData,
      };
      await generatePDF(pdfData);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // Calculate scores from database or use defaults
  const overallScore = roadmap.overallScore || 0;
  const operationsScore = roadmap.operationsScore || 0;
  const marketingScore = roadmap.marketingScore || 0;
  const salesScore = roadmap.salesScore || 0;
  const systemsScore = roadmap.systemsScore || 0;

  // Prepare benchmark data
  const benchmarkData = [
    {
      category: 'Operations',
      yourScore: operationsScore,
      industryAverage: 55,
      topPerformers: 85,
    },
    {
      category: 'Marketing',
      yourScore: marketingScore,
      industryAverage: 45,
      topPerformers: 80,
    },
    {
      category: 'Sales',
      yourScore: salesScore,
      industryAverage: 50,
      topPerformers: 85,
    },
    {
      category: 'Systems',
      yourScore: systemsScore,
      industryAverage: 60,
      topPerformers: 90,
    },
  ];

  // Calculate gap analysis from quiz data
  const calculateGapAnalysis = () => {
    const revenue = roadmap.monthlyRevenue || "";
    const currentRevenue = revenue.includes("$100K+") ? "$100K+" :
                          revenue.includes("$50K-$100K") ? "$50K-$100K" :
                          revenue.includes("$20K-$50K") ? "$20K-$50K" :
                          revenue.includes("$5K-$20K") ? "$5K-$20K" : "$0-$5K";
    
    // Estimate potential based on overall score
    const potentialMultiplier = overallScore >= 70 ? 2.5 : overallScore >= 50 ? 2.0 : 1.5;
    
    // Project revenue based on current and multiplier
    let potentialRevenue = "$20K-$40K";
    if (currentRevenue.includes("$100K+")) potentialRevenue = "$200K-$300K";
    else if (currentRevenue.includes("$50K-$100K")) potentialRevenue = "$125K-$200K";
    else if (currentRevenue.includes("$20K-$50K")) potentialRevenue = "$60K-$100K";
    else if (currentRevenue.includes("$5K-$20K")) potentialRevenue = "$30K-$50K";
    else potentialRevenue = "$10K-$20K";
    
    // Estimate leads based on revenue
    let currentLeads = 5;
    if (currentRevenue.includes("$100K+")) currentLeads = 50;
    else if (currentRevenue.includes("$50K-$100K")) currentLeads = 35;
    else if (currentRevenue.includes("$20K-$50K")) currentLeads = 20;
    else if (currentRevenue.includes("$5K-$20K")) currentLeads = 10;
    
    // Estimate close rate based on sales score
    let currentCloseRate = 12;
    if (salesScore >= 70) currentCloseRate = 35;
    else if (salesScore >= 50) currentCloseRate = 25;
    else if (salesScore >= 30) currentCloseRate = 18;
    
    return {
      currentRevenue,
      currentLeads,
      currentCloseRate,
      potentialRevenue,
      potentialLeads: Math.round(currentLeads * potentialMultiplier),
      potentialCloseRate: Math.min(currentCloseRate + 15, 40),
    };
  };
  
  const gapAnalysisData = calculateGapAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SkoolBanner />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {roadmap.businessName}
              </h1>
              <p className="text-gray-600 mt-1">Business Health Score Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="gap-2"
              >
                <Share2 size={18} />
                Share
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="gap-2"
              >
                {isDownloading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Booking CTA Banner */}
        {showBookingBanner && (
          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>🎯</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: "#1e3a5f" }}>
                  Your roadmap is ready!
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#3b6fa0" }}>
                  Book a free strategy call to walk through your results with an expert
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <a
                href="https://demo.doctorleadflow.com/booking"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "13px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Book Free Strategy Call →
              </a>
              <button
                onClick={() => setShowBookingBanner(false)}
                aria-label="Dismiss banner"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Score Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Score - Large Circular Gauge */}
          <Card className="p-4 sm:p-8 flex items-center justify-center bg-white">
            <CircularScoreGauge 
              score={overallScore} 
              label="Overall Health Score"
              size="large"
            />
          </Card>

          {/* Top Strength & Biggest Gap */}
          <Card className="p-6 bg-white lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-green-600" size={20} />
                  <h3 className="font-semibold text-green-900">Top Strength</h3>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {roadmap.topStrength || "Operations"}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  This is where you excel. Keep leveraging this advantage.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-orange-600" size={20} />
                  <h3 className="font-semibold text-orange-900">Biggest Gap</h3>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  {roadmap.biggestGap || "Marketing"}
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  Focus here first for maximum impact on revenue.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="p-4 sm:p-6 mb-8 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          <div>
            <CategoryBreakdownChart
              leadGeneration={operationsScore}
              offerClarity={systemsScore}
              socialPresence={marketingScore}
              conversionProcess={salesScore}
            />
          </div>
        </Card>

        {/* Benchmark Comparison */}
        <Card className="p-4 sm:p-6 mb-8 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">How You Compare</h2>
          <p className="text-gray-600 mb-4">
            See how your scores stack up against industry averages and top performers
          </p>
          <div style={{ height: '300px' }}>
            <BenchmarkComparisonChart data={benchmarkData} />
          </div>
        </Card>

        {/* Gap Analysis */}
        <Card className="p-6 mb-8 bg-white">
          <GapAnalysisVisual {...gapAnalysisData} />
        </Card>

        {/* Playbooks Section */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Roadmap</h2>
          
          {/* Playbook Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={activePlaybook === "titan" ? "default" : "outline"}
              onClick={() => setActivePlaybook("titan")}
              size="sm"
            >
              Titan Roadmap
            </Button>
            {roadmap.offerPlaybook && (
              <Button
                variant={activePlaybook === "offer" ? "default" : "outline"}
                onClick={() => setActivePlaybook("offer")}
                size="sm"
              >
                Offer Optimization
              </Button>
            )}
            {roadmap.facebookAdLaunch && (
              <Button
                variant={activePlaybook === "facebook" ? "default" : "outline"}
                onClick={() => setActivePlaybook("facebook")}
                size="sm"
              >
                Facebook Ads
              </Button>
            )}
            {roadmap.instagramGrowth && (
              <Button
                variant={activePlaybook === "instagram" ? "default" : "outline"}
                onClick={() => setActivePlaybook("instagram")}
                size="sm"
              >
                Instagram Growth
              </Button>
            )}
            {roadmap.leadGeneration && (
              <Button
                variant={activePlaybook === "leadgen" ? "default" : "outline"}
                onClick={() => setActivePlaybook("leadgen")}
                size="sm"
              >
                Lead Generation
              </Button>
            )}
          </div>

          {/* Share Playbook Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 size={16} />
              Share this playbook
            </Button>
          </div>

          {/* Playbook Content */}
          <div className="max-w-none">
            {activePlaybook === "titan" && roadmap.titanRoadmap && (
              (() => {
                try {
                  const data = JSON.parse(roadmap.titanRoadmap);
                  return (
                    <VisualTitanRoadmap
                      data={data}
                      roadmapId={roadmapId!}
                      completedTasks={completedTasks}
                      onToggleTask={handleToggleTask}
                    />
                  );
                } catch (e) {
                  return <Streamdown>{roadmap.titanRoadmap}</Streamdown>;
                }
              })()
            )}
            {activePlaybook === "offer" && roadmap.offerPlaybook && (
              (() => {
                try {
                  const data = JSON.parse(roadmap.offerPlaybook);
                  return (
                    <VisualPlaybook
                      data={data}
                      roadmapId={roadmapId!}
                      playbookType={activePlaybook as "offer" | "facebook" | "instagram" | "leadgen"}
                      completedTasks={completedTasks}
                      onToggleTask={handleToggleTask}
                    />
                  );
                } catch (e) {
                  return <Streamdown>{roadmap.offerPlaybook}</Streamdown>;
                }
              })()
            )}
            {activePlaybook === "facebook" && roadmap.facebookAdLaunch && (
              (() => {
                try {
                  const data = JSON.parse(roadmap.facebookAdLaunch);
                  return (
                    <VisualPlaybook
                      data={data}
                      roadmapId={roadmapId!}
                      playbookType={activePlaybook as "offer" | "facebook" | "instagram" | "leadgen"}
                      completedTasks={completedTasks}
                      onToggleTask={handleToggleTask}
                    />
                  );
                } catch (e) {
                  return <Streamdown>{roadmap.facebookAdLaunch}</Streamdown>;
                }
              })()
            )}
            {activePlaybook === "instagram" && roadmap.instagramGrowth && (
              (() => {
                try {
                  const data = JSON.parse(roadmap.instagramGrowth);
                  return (
                    <VisualPlaybook
                      data={data}
                      roadmapId={roadmapId!}
                      playbookType={activePlaybook as "offer" | "facebook" | "instagram" | "leadgen"}
                      completedTasks={completedTasks}
                      onToggleTask={handleToggleTask}
                    />
                  );
                } catch (e) {
                  return <Streamdown>{roadmap.instagramGrowth}</Streamdown>;
                }
              })()
            )}
            {activePlaybook === "leadgen" && roadmap.leadGeneration && (
              (() => {
                try {
                  const data = JSON.parse(roadmap.leadGeneration);
                  return (
                    <VisualPlaybook
                      data={data}
                      roadmapId={roadmapId!}
                      playbookType={activePlaybook as "offer" | "facebook" | "instagram" | "leadgen"}
                      completedTasks={completedTasks}
                      onToggleTask={handleToggleTask}
                    />
                  );
                } catch (e) {
                  return <Streamdown>{roadmap.leadGeneration}</Streamdown>;
                }
              })()
            )}
          </div>
        </Card>
      </div>

      {/* What's Next Section */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="p-4 sm:p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl overflow-hidden">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Scale Faster?</h2>
            <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-blue-100 px-1">
              You've got your roadmap. Now let's implement it together. Join 5,000+ health professionals getting weekly scaling strategies, live Q&A sessions, and proven playbooks.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center items-center w-full">
              <a
                href="https://skool.com/10ksidehustle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 shadow-lg w-full sm:w-auto"
                >
                  Join Health Pro CEO Community (Free)
                </Button>
              </a>
              <a
                href="https://demo.doctorleadflow.com/booking"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  Book Strategy Call
                </Button>
              </a>
            </div>
            <p className="text-xs sm:text-sm mt-4 sm:mt-6 text-blue-200 px-1">
              🎯 Community: Free templates, live workshops, peer support<br/>
              📞 Strategy Call: 1-on-1 implementation roadmap (15 min)
            </p>
          </div>
        </Card>
      </div>

      {/* Share Playbook Modal */}
      <SharePlaybookModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roadmapId={roadmapId!}
        playbookType={activePlaybook}
        playbookName={
          activePlaybook === "titan"
            ? "Titan Roadmap"
            : activePlaybook === "offer"
            ? "Offer Optimization"
            : activePlaybook === "facebook"
            ? "Facebook Ads Strategy"
            : activePlaybook === "instagram"
            ? "Instagram Growth"
            : "Lead Generation System"
        }
      />
    </div>
  );
}
