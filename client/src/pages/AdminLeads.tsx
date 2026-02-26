import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Download, Filter, X } from "lucide-react";
import { Link } from "wouter";

export default function AdminLeads() {
  const [revenueFilter, setRevenueFilter] = useState<string | undefined>();
  const [frustrationFilter, setFrustrationFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<"new" | "contacted" | "qualified" | "converted" | undefined>();

  const { data: roadmaps, isLoading } = trpc.roadmap.getAllRoadmaps.useQuery({
    monthlyRevenue: revenueFilter,
    biggestFrustration: frustrationFilter,
    status: statusFilter,
  });

  const utils = trpc.useUtils();
  const updateStatus = trpc.roadmap.updateLeadStatus.useMutation({
    onSuccess: () => {
      utils.roadmap.getAllRoadmaps.invalidate();
    },
  });

  const handleExportCSV = () => {
    if (!roadmaps || roadmaps.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Business",
      "Type",
      "Revenue",
      "Frustration",
      "Goal",
      "Status",
      "Score",
      "Instagram",
      "Created",
    ];

    const rows = roadmaps.map((r) => [
      r.id,
      r.firstName,
      r.email,
      r.businessName,
      r.businessType,
      r.monthlyRevenue,
      r.biggestFrustration,
      r.ninetyDayGoal,
      r.status,
      r.leadScore,
      r.instagramHandle,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setRevenueFilter(undefined);
    setFrustrationFilter(undefined);
    setStatusFilter(undefined);
  };

  const totalLeads = roadmaps?.length || 0;
  const avgRevenue = roadmaps
    ? roadmaps.reduce((sum, r) => {
        const revenueMap: Record<string, number> = {
          "Under $10K/month": 5000,
          "$10K-$20K/month": 15000,
          "$20K-$50K/month": 35000,
          "$50K-$100K/month": 75000,
          "$100K+/month": 150000,
        };
        return sum + (r.monthlyRevenue ? revenueMap[r.monthlyRevenue] || 0 : 0);
      }, 0) / totalLeads
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Lead Dashboard</h1>
            <p className="text-slate-400 mt-1">
              View and manage all quiz submissions
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-slate-400 text-sm">Total Leads</div>
            <div className="text-3xl font-bold text-white mt-2 tabular-nums">
              {totalLeads}
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-slate-400 text-sm">Avg Revenue</div>
            <div className="text-3xl font-bold text-[#E5C158] mt-2 tabular-nums">
              ${(avgRevenue / 1000).toFixed(0)}K
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-slate-400 text-sm">This Month</div>
            <div className="text-3xl font-bold text-white mt-2 tabular-nums">
              {roadmaps?.filter((r) => {
                const created = new Date(r.createdAt);
                const now = new Date();
                return (
                  created.getMonth() === now.getMonth() &&
                  created.getFullYear() === now.getFullYear()
                );
              }).length || 0}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filters:</span>
            </div>

            <Select value={revenueFilter} onValueChange={setRevenueFilter}>
              <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Revenue Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under $10K/month">Under $10K/month</SelectItem>
                <SelectItem value="$10K-$20K/month">$10K-$20K/month</SelectItem>
                <SelectItem value="$20K-$50K/month">$20K-$50K/month</SelectItem>
                <SelectItem value="$50K-$100K/month">$50K-$100K/month</SelectItem>
                <SelectItem value="$100K+/month">$100K+/month</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={frustrationFilter}
              onValueChange={setFrustrationFilter}
            >
              <SelectTrigger className="w-[250px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Frustration Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not enough leads">Not enough leads</SelectItem>
                <SelectItem value="Leads aren't converting">
                  Leads aren't converting
                </SelectItem>
                <SelectItem value="no-shows">No-shows/cancellations</SelectItem>
                <SelectItem value="Can't scale">Can't scale past current revenue</SelectItem>
                <SelectItem value="marketing">Don't know what marketing works</SelectItem>
                <SelectItem value="ads">Spending on ads with no ROI</SelectItem>
                <SelectItem value="content">No time to create content</SelectItem>
                <SelectItem value="myself">Doing everything myself</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Lead Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            {(revenueFilter || frustrationFilter || statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            <div className="ml-auto">
              <Button
                onClick={handleExportCSV}
                disabled={!roadmaps || roadmaps.length === 0}
                className="bg-[#E5C158] hover:bg-[#E5C158]/90 text-[#0A0E1A]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              Loading leads...
            </div>
          ) : !roadmaps || roadmaps.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No leads found. Try adjusting your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Business</TableHead>
                    <TableHead className="text-slate-300">Revenue</TableHead>
                    <TableHead className="text-slate-300">Frustration</TableHead>
                    <TableHead className="text-slate-300">Goal</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Score</TableHead>
                    <TableHead className="text-slate-300">Created</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roadmaps.map((roadmap) => (
                    <TableRow
                      key={roadmap.id}
                      className="border-slate-700 hover:bg-slate-700/50"
                    >
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{roadmap.firstName}</div>
                          <div className="text-sm text-slate-400">
                            {roadmap.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div>
                          <div className="font-medium">
                            {roadmap.businessName}
                          </div>
                          <div className="text-sm text-slate-400">
                            {roadmap.businessType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#E5C158] font-medium tabular-nums">
                        {roadmap.monthlyRevenue}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-[200px] truncate">
                        {roadmap.biggestFrustration}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-[200px] truncate">
                        {roadmap.ninetyDayGoal}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={roadmap.status}
                          onValueChange={(value) => {
                            updateStatus.mutate({
                              id: roadmap.id,
                              status: value as "new" | "contacted" | "qualified" | "converted",
                            });
                          }}
                        >
                          <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold tabular-nums">
                            {roadmap.leadScore}
                          </span>
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-slate-500 via-[#E5C158] to-[#E5C158]"
                              style={{ width: `${roadmap.leadScore}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 tabular-nums">
                        {new Date(roadmap.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/${roadmap.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
