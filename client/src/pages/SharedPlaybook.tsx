import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Streamdown } from "streamdown";
import { VisualPlaybook } from "@/components/VisualPlaybook";
import { VisualTitanRoadmap } from "@/components/VisualTitanRoadmap";
import { trpc } from "@/lib/trpc";

export default function SharedPlaybook() {
  const [, params] = useRoute("/playbook/:token");
  const token = params?.token;

  const { data: playbookData, isLoading, error } = trpc.progress.getSharedPlaybook.useQuery(
    { token: token! },
    { enabled: !!token }
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Invalid share link</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Loading playbook...</h2>
        </div>
      </div>
    );
  }

  if (error || !playbookData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Playbook not found</h2>
          <p className="text-gray-600">This share link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const getPlaybookTitle = (type: string) => {
    switch (type) {
      case "titan":
        return "Titan Roadmap";
      case "offer":
        return "Offer Optimization";
      case "facebook":
        return "Facebook Ads Strategy";
      case "instagram":
        return "Instagram Growth";
      case "leadgen":
        return "Lead Generation System";
      default:
        return "Playbook";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {playbookData.businessName}
            </h1>
            <p className="text-gray-600">{getPlaybookTitle(playbookData.playbookType)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 bg-white">
          <div className="max-w-none">
            {(() => {
              try {
                const data = JSON.parse(playbookData.playbookContent);
                
                if (playbookData.playbookType === "titan") {
                  return (
                    <VisualTitanRoadmap
                      data={data}
                      roadmapId={0} // Not needed for shared view
                      completedTasks={[]} // No progress tracking for shared view
                      onToggleTask={() => {}} // No-op for shared view
                    />
                  );
                } else {
                  return (
                    <VisualPlaybook
                      data={data}
                      roadmapId={0} // Not needed for shared view
                      playbookType={playbookData.playbookType as "offer" | "facebook" | "instagram" | "leadgen"}
                      completedTasks={[]} // No progress tracking for shared view
                      onToggleTask={() => {}} // No-op for shared view
                    />
                  );
                }
              } catch (e) {
                // Fallback to text rendering
                return <Streamdown>{playbookData.playbookContent}</Streamdown>;
              }
            })()}
          </div>
        </Card>
      </div>
    </div>
  );
}
