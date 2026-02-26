import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SharePlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: number;
  playbookType: "titan" | "offer" | "facebook" | "instagram" | "leadgen";
  playbookName: string;
}

export function SharePlaybookModal({
  isOpen,
  onClose,
  roadmapId,
  playbookType,
  playbookName,
}: SharePlaybookModalProps) {
  const [isCopied, setIsCopied] = useState(false);


  const [shareLink, setShareLink] = useState<string | null>(null);

  // Generate share link when modal opens
  const generateLink = trpc.progress.generateShareLink.useMutation({
    onSuccess: (data) => {
      const link = `${window.location.origin}/playbook/${data.token}`;
      setShareLink(link);
    },
  });

  // Generate link when modal opens
  useEffect(() => {
    if (isOpen && !shareLink && !generateLink.isPending) {
      generateLink.mutate({ roadmapId, playbookType });
    }
  }, [isOpen, shareLink, generateLink.isPending]);

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            Share {playbookName}
          </DialogTitle>
          <DialogDescription>
            Anyone with this link can view this playbook
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {generateLink.isPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : shareLink ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Share this link with clients, team members, or save it for later reference.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Failed to generate share link. Please try again.</p>
              <Button
                onClick={() => generateLink.mutate({ roadmapId, playbookType })}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
