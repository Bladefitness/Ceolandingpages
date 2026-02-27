import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Plus, Trash2, Play, CheckCircle, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  weight: number;
  contentOverrides: string;
}

interface SplitTest {
  id: number;
  name: string;
  pageSlug: string;
  status: "draft" | "running" | "completed";
  variants: string;
  startedAt: string | null;
  completedAt: string | null;
  winnerVariantId: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: SplitTest["status"]) {
  if (status === "running") {
    return (
      <Badge className="bg-green-700/40 text-green-300 border-green-700">
        Running
      </Badge>
    );
  }
  if (status === "completed") {
    return (
      <Badge className="bg-blue-700/40 text-blue-300 border-blue-700">
        Completed
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-700/60 text-slate-400 border-slate-600">
      Draft
    </Badge>
  );
}

function parseVariants(raw: string): Variant[] {
  try {
    return JSON.parse(raw) as Variant[];
  } catch {
    return [];
  }
}

function makeDefaultVariants(): Variant[] {
  return [
    { id: nanoid(8), name: "Control", weight: 50, contentOverrides: "" },
    { id: nanoid(8), name: "Variant B", weight: 50, contentOverrides: "" },
  ];
}

// ── Create Test Dialog ────────────────────────────────────────────────────────

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function CreateTestDialog({ open, onClose, onCreated }: CreateDialogProps) {
  const [name, setName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [variants, setVariants] = useState<Variant[]>(makeDefaultVariants);

  const create = trpc.funnelAdmin.splitTests.create.useMutation({
    onSuccess: () => {
      toast.success("Split test created");
      onCreated();
      handleClose();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleClose() {
    setName("");
    setPageSlug("");
    setVariants(makeDefaultVariants());
    onClose();
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { id: nanoid(8), name: `Variant ${String.fromCharCode(65 + prev.length)}`, weight: 0, contentOverrides: "" },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!pageSlug) {
      toast.error("Page slug is required");
      return;
    }
    if (variants.length < 2) {
      toast.error("At least 2 variants are required");
      return;
    }

    const serialized = JSON.stringify(
      variants.map((v) => ({
        id: v.id,
        name: v.name,
        weight: v.weight,
        contentOverrides: v.contentOverrides ? JSON.parse(v.contentOverrides) : {},
      }))
    );

    create.mutate({ name: name.trim(), pageSlug, variants: serialized });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Create Split Test</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sales page headline test"
              className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Page Slug */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Page</label>
            <Select value={pageSlug} onValueChange={setPageSlug}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="upsell">Upsell</SelectItem>
                <SelectItem value="downsell">Downsell</SelectItem>
                <SelectItem value="thank-you">Thank You</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Variants</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addVariant}
                className="text-slate-400 hover:text-white h-7 px-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="rounded-md border border-slate-700 bg-slate-800/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {variant.id}
                    </span>
                    {variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Name</label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-slate-200 h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Weight (%)</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={variant.weight}
                        onChange={(e) => updateVariant(index, "weight", Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-slate-200 h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">
                      Content Overrides (JSON)
                    </label>
                    <textarea
                      value={variant.contentOverrides}
                      onChange={(e) => updateVariant(index, "contentOverrides", e.target.value)}
                      placeholder='{"headline": "New headline"}'
                      rows={3}
                      className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 font-mono resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={create.isPending}
            className="bg-slate-100 text-slate-900 hover:bg-white"
          >
            {create.isPending ? "Creating..." : "Create Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Complete Test Dialog ───────────────────────────────────────────────────────

interface CompleteDialogProps {
  test: SplitTest | null;
  onClose: () => void;
  onCompleted: () => void;
}

function CompleteTestDialog({ test, onClose, onCompleted }: CompleteDialogProps) {
  const [selectedWinner, setSelectedWinner] = useState("");

  const complete = trpc.funnelAdmin.splitTests.complete.useMutation({
    onSuccess: () => {
      toast.success("Test marked as completed");
      onCompleted();
      onClose();
      setSelectedWinner("");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const variants = test ? parseVariants(test.variants) : [];

  function handleConfirm() {
    if (!test) return;
    if (!selectedWinner) {
      toast.error("Please select a winner");
      return;
    }
    complete.mutate({ id: test.id, winnerVariantId: selectedWinner });
  }

  return (
    <Dialog open={!!test} onOpenChange={(o) => { if (!o) { onClose(); setSelectedWinner(""); } }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Complete Split Test</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-sm text-slate-400">
            Select the winning variant for{" "}
            <span className="text-slate-200 font-medium">{test?.name}</span>:
          </p>

          <div className="space-y-2">
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
                  selectedWinner === variant.id
                    ? "border-slate-400 bg-slate-700"
                    : "border-slate-700 bg-slate-800/40 hover:bg-slate-800"
                }`}
              >
                <input
                  type="radio"
                  name="winner"
                  value={variant.id}
                  checked={selectedWinner === variant.id}
                  onChange={() => setSelectedWinner(variant.id)}
                  className="accent-slate-300"
                />
                <span className="text-slate-200">{variant.name}</span>
                <span className="ml-auto text-xs text-slate-500 font-mono">{variant.id}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => { onClose(); setSelectedWinner(""); }}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={complete.isPending || !selectedWinner}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            {complete.isPending ? "Saving..." : "Confirm Winner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Stats Dialog ───────────────────────────────────────────────────────────────

interface StatsDialogProps {
  test: SplitTest | null;
  onClose: () => void;
}

function StatsDialog({ test, onClose }: StatsDialogProps) {
  const { data: stats, isLoading } = trpc.funnelAdmin.analytics.splitTests.useQuery(
    { testId: test?.id ?? 0 },
    { enabled: !!test }
  );

  const variants = test ? parseVariants(test.variants) : [];

  function variantName(variantId: string): string {
    return variants.find((v) => v.id === variantId)?.name ?? variantId;
  }

  return (
    <Dialog open={!!test} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            Stats — {test?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <p className="text-slate-400 text-sm py-4 text-center">Loading stats...</p>
          ) : !stats || stats.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">
              No data recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Variant</TableHead>
                  <TableHead className="text-slate-400 text-right">Views</TableHead>
                  <TableHead className="text-slate-400 text-right">Conversions</TableHead>
                  <TableHead className="text-slate-400 text-right">Conv. Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((row) => (
                  <TableRow key={row.variantId} className="border-slate-700 hover:bg-slate-800/40">
                    <TableCell className="text-slate-200 font-medium">
                      {variantName(row.variantId)}
                      {test?.winnerVariantId === row.variantId && (
                        <Badge className="ml-2 bg-yellow-700/40 text-yellow-300 border-yellow-700 text-xs">
                          Winner
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300 text-right tabular-nums">
                      {row.views}
                    </TableCell>
                    <TableCell className="text-slate-300 text-right tabular-nums">
                      {row.conversions}
                    </TableCell>
                    <TableCell className="text-slate-300 text-right tabular-nums">
                      {row.conversionRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FunnelSplitTests() {
  const [showCreate, setShowCreate] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<SplitTest | null>(null);
  const [statsTarget, setStatsTarget] = useState<SplitTest | null>(null);

  const { data: tests, isLoading, refetch } = trpc.funnelAdmin.splitTests.list.useQuery();
  const utils = trpc.useUtils();

  const start = trpc.funnelAdmin.splitTests.start.useMutation({
    onSuccess: () => {
      toast.success("Test started");
      utils.funnelAdmin.splitTests.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleStartTest(id: number) {
    start.mutate({ id });
  }

  function handleRefresh() {
    refetch();
    utils.funnelAdmin.splitTests.list.invalidate();
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Split Tests</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage A/B tests across funnel pages
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-slate-100 text-slate-900 hover:bg-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading tests...</div>
          ) : !tests || tests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No split tests yet. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Page</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-center">Variants</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(tests as SplitTest[]).map((test) => {
                  const variants = parseVariants(test.variants);
                  return (
                    <TableRow
                      key={test.id}
                      className="border-slate-700 hover:bg-slate-700/30"
                    >
                      <TableCell className="text-slate-200 font-medium">
                        {test.name}
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono text-sm">
                        {test.pageSlug}
                      </TableCell>
                      <TableCell>{statusBadge(test.status)}</TableCell>
                      <TableCell className="text-slate-400 text-center tabular-nums">
                        {variants.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {test.status === "draft" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartTest(test.id)}
                              disabled={start.isPending}
                              className="text-green-400 hover:text-green-300 hover:bg-green-900/20 h-7 px-2"
                            >
                              <Play className="w-3.5 h-3.5 mr-1" />
                              Start
                            </Button>
                          )}
                          {test.status === "running" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCompleteTarget(test)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-7 px-2"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Complete
                            </Button>
                          )}
                          {(test.status === "running" || test.status === "completed") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setStatsTarget(test)}
                              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 h-7 px-2"
                            >
                              <BarChart2 className="w-3.5 h-3.5 mr-1" />
                              View Stats
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateTestDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleRefresh}
      />

      <CompleteTestDialog
        test={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onCompleted={handleRefresh}
      />

      <StatsDialog
        test={statsTarget}
        onClose={() => setStatsTarget(null)}
      />
    </div>
  );
}
