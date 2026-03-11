import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { MuxVideoUploader } from "@/components/admin/MuxVideoUploader";
import {
  Film,
  Copy,
  Trash2,
  Clock,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Code,
  ExternalLink,
  Subtitles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Converts "00:00:04.320" → "0:04"
function shortTime(ts: string): string {
  const parts = ts.split(":");
  if (parts.length < 3) return ts;
  const mins = parseInt(parts[1], 10);
  const secs = Math.floor(parseFloat(parts[2]));
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const STATUS_BADGE: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ready: { label: "Ready", color: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50", icon: <CheckCircle className="w-3 h-3" /> },
  preparing: { label: "Processing", color: "text-yellow-400 bg-yellow-900/30 border-yellow-700/50", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  errored: { label: "Error", color: "text-red-400 bg-red-900/30 border-red-700/50", icon: <AlertCircle className="w-3 h-3" /> },
};

const CAPTION_BADGE: Record<string, { label: string; color: string }> = {
  ready: { label: "CC Ready", color: "text-blue-400 bg-blue-900/30 border-blue-700/50" },
  generating: { label: "CC Generating", color: "text-yellow-400 bg-yellow-900/30 border-yellow-700/50" },
  none: { label: "No CC", color: "text-slate-500 bg-slate-800/30 border-slate-700/50" },
};

type AssetRow = {
  id: number;
  muxAssetId: string;
  playbackId: string | null;
  status: "preparing" | "ready" | "errored";
  captionStatus?: "generating" | "ready" | "none" | null;
  duration: number | null;
  filename: string | null;
  title: string | null;
  createdAt: Date | string;
};

function TranscriptPanel({ muxAssetId }: { muxAssetId: string }) {
  const captionsQuery = trpc.funnelAdmin.mux.getCaptions.useQuery(
    { muxAssetId },
    { retry: false },
  );

  if (captionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading transcript...
      </div>
    );
  }

  if (captionsQuery.isError) {
    return (
      <p className="py-4 text-center text-red-400 text-sm">
        Failed to load transcript
      </p>
    );
  }

  const captions = captionsQuery.data?.captions ?? [];

  if (captions.length === 0) {
    return (
      <p className="py-4 text-center text-slate-500 text-sm">
        No captions available yet. They may still be generating.
      </p>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {captions.map((line, idx) => (
        <div key={idx} className="flex gap-3 text-sm group hover:bg-slate-700/30 rounded px-1 py-0.5">
          <span className="shrink-0 text-blue-400 font-mono text-xs pt-0.5 w-10">
            {shortTime(line.startTime)}
          </span>
          <span className="text-slate-300 leading-snug">{line.text}</span>
        </div>
      ))}
    </div>
  );
}

function VideoCard({
  asset,
  onCopyToClipboard,
  onDelete,
  deleteIsPending,
  onGenerateCaptions,
  generateCaptionsIsPending,
}: {
  asset: AssetRow;
  onCopyToClipboard: (text: string, label: string) => void;
  onDelete: (muxAssetId: string) => void;
  deleteIsPending: boolean;
  onGenerateCaptions: (muxAssetId: string) => void;
  generateCaptionsIsPending: boolean;
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  const badge = STATUS_BADGE[asset.status] ?? STATUS_BADGE.preparing;
  const captionBadge = asset.captionStatus ? CAPTION_BADGE[asset.captionStatus] : null;
  const canShowTranscript = asset.status === "ready" && asset.captionStatus === "ready" && !!asset.muxAssetId;
  const canGenerateCaptions = asset.status === "ready" && (!asset.captionStatus || asset.captionStatus === "none") && !!asset.muxAssetId;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-900 relative">
        {asset.playbackId ? (
          <img
            src={`https://image.mux.com/${asset.playbackId}/thumbnail.webp?time=2`}
            alt={asset.title ?? asset.filename ?? "Video"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-10 h-10 text-slate-600" />
          </div>
        )}
        {asset.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(asset.duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {asset.title ?? asset.filename ?? "Untitled"}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">{formatDate(asset.createdAt)}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${badge.color}`}>
              {badge.icon}
              {badge.label}
            </span>
            {captionBadge && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${captionBadge.color}`}>
                <Subtitles className="w-3 h-3" />
                {captionBadge.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {asset.playbackId && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCopyToClipboard(asset.playbackId!, "Playback ID")}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy ID
            </button>
            <button
              onClick={() =>
                onCopyToClipboard(
                  `<mux-player playback-id="${asset.playbackId}" autoplay="muted"></mux-player>`,
                  "Embed code",
                )
              }
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            >
              <Code className="w-3 h-3" />
              Embed
            </button>
            <a
              href={`/v/${asset.playbackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Preview
            </a>
            {canShowTranscript && (
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 px-2 py-1 rounded transition-colors"
              >
                <Subtitles className="w-3 h-3" />
                Transcript
                {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
            {canGenerateCaptions && (
              <button
                onClick={() => onGenerateCaptions(asset.muxAssetId)}
                disabled={generateCaptionsIsPending}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-900/20 hover:bg-purple-900/40 px-2 py-1 rounded transition-colors"
              >
                {generateCaptionsIsPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Subtitles className="w-3 h-3" />}
                Generate Captions
              </button>
            )}
            <button
              onClick={() => onDelete(asset.muxAssetId)}
              disabled={deleteIsPending}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-2 py-1 rounded transition-colors ml-auto"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}

        {/* Transcript Panel */}
        {showTranscript && canShowTranscript && (
          <div className="border-t border-slate-700 pt-3 mt-1">
            <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1">
              <Subtitles className="w-3 h-3" />
              Transcript
            </p>
            <TranscriptPanel muxAssetId={asset.muxAssetId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoLibrary() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();

  const assetsQuery = trpc.funnelAdmin.mux.list.useQuery();

  const hasPreparing = (assetsQuery.data ?? []).some(
    (a) => a.status === "preparing" || a.captionStatus === "generating",
  );

  const syncMutation = trpc.funnelAdmin.mux.syncPreparing.useMutation({
    onSuccess: (data) => {
      if (data.synced > 0) utils.funnelAdmin.mux.list.invalidate();
    },
  });

  // Auto-sync preparing assets every 5 seconds
  useEffect(() => {
    if (!hasPreparing) return;
    syncMutation.mutate();
    const interval = setInterval(() => syncMutation.mutate(), 5000);
    return () => clearInterval(interval);
  }, [hasPreparing]);

  const deleteMutation = trpc.funnelAdmin.mux.delete.useMutation({
    onSuccess: () => {
      utils.funnelAdmin.mux.list.invalidate();
      toast.success("Video deleted");
    },
    onError: () => toast.error("Failed to delete video"),
  });

  const generateCaptionsMutation = trpc.funnelAdmin.mux.generateCaptions.useMutation({
    onSuccess: () => {
      utils.funnelAdmin.mux.list.invalidate();
      toast.success("Caption generation started — this may take a few minutes");
    },
    onError: (err) => toast.error(`Failed to generate captions: ${err.message}`),
  });

  const statsQuery = trpc.funnelAdmin.analytics.videoEngagement.useQuery({});

  const assets = (assetsQuery.data ?? []) as AssetRow[];
  const filtered = search
    ? assets.filter((a) =>
        (a.title ?? a.filename ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : assets;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleDelete = (muxAssetId: string) => {
    if (!confirm("Delete this video permanently?")) return;
    deleteMutation.mutate({ muxAssetId });
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Video Library</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload and manage Mux-hosted videos
          </p>
        </div>

        {/* Quick Stats */}
        {statsQuery.data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Plays</p>
              <p className="text-white text-xl font-bold mt-0.5">
                {statsQuery.data.totalPlays.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Avg Watch Time</p>
              <p className="text-white text-xl font-bold mt-0.5">
                {formatDuration(statsQuery.data.avgWatchTime)}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Completion Rate</p>
              <p className="text-white text-xl font-bold mt-0.5">
                {statsQuery.data.completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Upload Video</h2>
          <MuxVideoUploader
            onComplete={() => utils.funnelAdmin.mux.list.invalidate()}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Video Grid */}
        {assetsQuery.isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading videos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{search ? "No videos match your search" : "No videos uploaded yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((asset) => (
              <VideoCard
                key={asset.id}
                asset={asset}
                onCopyToClipboard={copyToClipboard}
                onDelete={handleDelete}
                deleteIsPending={deleteMutation.isPending}
                onGenerateCaptions={(id) => generateCaptionsMutation.mutate({ muxAssetId: id })}
                generateCaptionsIsPending={generateCaptionsMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
