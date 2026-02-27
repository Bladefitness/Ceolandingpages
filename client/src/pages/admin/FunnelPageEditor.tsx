import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, Save } from "lucide-react";

type PageSlug = "sales" | "upsell" | "downsell" | "thank-you";

const PAGE_SLUGS: PageSlug[] = ["sales", "upsell", "downsell", "thank-you"];

interface FaqItem {
  q: string;
  a: string;
}

interface FormState {
  headline: string;
  subheadline: string;
  bodyText: string;
  ctaText: string;
  declineText: string;
  originalPriceCents: string;
  salePriceCents: string;
  heroImageUrl: string;
  videoUrl: string;
  senjaWidgetId: string;
  valueStackItems: string[];
  faqItems: FaqItem[];
}

const EMPTY_FORM: FormState = {
  headline: "",
  subheadline: "",
  bodyText: "",
  ctaText: "",
  declineText: "",
  originalPriceCents: "",
  salePriceCents: "",
  heroImageUrl: "",
  videoUrl: "",
  senjaWidgetId: "",
  valueStackItems: [],
  faqItems: [],
};

function parseValueStack(raw: unknown): string[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // ignore
  }
  return [];
}

function parseFaqItems(raw: unknown): FaqItem[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) {
      return parsed.map((item: unknown) => {
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          return { q: String(obj.q ?? ""), a: String(obj.a ?? "") };
        }
        return { q: "", a: "" };
      });
    }
  } catch {
    // ignore
  }
  return [];
}

function dataToForm(data: Record<string, unknown>): FormState {
  return {
    headline: String(data.headline ?? ""),
    subheadline: String(data.subheadline ?? ""),
    bodyText: String(data.bodyText ?? ""),
    ctaText: String(data.ctaText ?? ""),
    declineText: String(data.declineText ?? ""),
    originalPriceCents: data.originalPriceCents != null ? String(data.originalPriceCents) : "",
    salePriceCents: data.salePriceCents != null ? String(data.salePriceCents) : "",
    heroImageUrl: String(data.heroImageUrl ?? ""),
    videoUrl: String(data.videoUrl ?? ""),
    senjaWidgetId: String(data.senjaWidgetId ?? ""),
    valueStackItems: parseValueStack(data.valueStackItems),
    faqItems: parseFaqItems(data.faqItems),
  };
}

function formToPayload(slug: PageSlug, form: FormState) {
  return {
    slug,
    headline: form.headline || undefined,
    subheadline: form.subheadline || undefined,
    bodyText: form.bodyText || undefined,
    ctaText: form.ctaText || undefined,
    declineText: form.declineText || undefined,
    originalPriceCents: form.originalPriceCents !== "" ? Number(form.originalPriceCents) : undefined,
    salePriceCents: form.salePriceCents !== "" ? Number(form.salePriceCents) : undefined,
    heroImageUrl: form.heroImageUrl || undefined,
    videoUrl: form.videoUrl || undefined,
    senjaWidgetId: form.senjaWidgetId || undefined,
    valueStackItems: JSON.stringify(form.valueStackItems),
    faqItems: JSON.stringify(form.faqItems),
  };
}

interface ValueStackEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
}

function ValueStackEditor({ items, onChange }: ValueStackEditorProps) {
  function updateItem(index: number, value: string) {
    const next = items.map((item, i) => (i === index ? value : item));
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Value item ${index + 1}`}
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="text-slate-400 hover:text-red-400 hover:bg-slate-700 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

interface FaqEditorProps {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}

function FaqEditor({ items, onChange }: FaqEditorProps) {
  function updateItem(index: number, field: "q" | "a", value: string) {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { q: "", a: "" }]);
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border border-slate-700 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2">
              <Input
                value={item.q}
                onChange={(e) => updateItem(index, "q", e.target.value)}
                placeholder="Question"
                className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
              />
              <Textarea
                value={item.a}
                onChange={(e) => updateItem(index, "a", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 resize-none"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-slate-400 hover:text-red-400 hover:bg-slate-700 flex-shrink-0 mt-0.5"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add FAQ
      </Button>
    </div>
  );
}

interface PageEditorPanelProps {
  slug: PageSlug;
}

function PageEditorPanel({ slug }: PageEditorPanelProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [notFound, setNotFound] = useState(false);

  const { data, error, isLoading } = trpc.funnelAdmin.pages.get.useQuery(
    { slug },
    {
      retry: (failureCount, err) => {
        if ((err as { data?: { code?: string } })?.data?.code === "NOT_FOUND") return false;
        return failureCount < 2;
      },
    }
  );

  const updateMutation = trpc.funnelAdmin.pages.update.useMutation({
    onSuccess: () => {
      toast.success("Page saved successfully.");
    },
    onError: (err) => {
      toast.error(`Save failed: ${err.message}`);
    },
  });

  useEffect(() => {
    if (data) {
      setNotFound(false);
      setForm(dataToForm(data as Record<string, unknown>));
    } else if (error) {
      const code = (error as { data?: { code?: string } })?.data?.code;
      if (code === "NOT_FOUND") {
        setNotFound(true);
        setForm(EMPTY_FORM);
      }
    }
  }, [data, error]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    updateMutation.mutate(formToPayload(slug, form));
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400">Loading page content...</div>
    );
  }

  return (
    <div className="space-y-6">
      {notFound && (
        <div className="rounded-md border border-slate-700 bg-slate-800/50 p-4 text-slate-400 text-sm">
          No content saved yet for this page. Fill in the fields below and save to create it.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">Headline</Label>
          <Input
            value={form.headline}
            onChange={(e) => setField("headline", e.target.value)}
            placeholder="Main headline"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Subheadline</Label>
          <Input
            value={form.subheadline}
            onChange={(e) => setField("subheadline", e.target.value)}
            placeholder="Supporting subheadline"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Body Text</Label>
        <Textarea
          value={form.bodyText}
          onChange={(e) => setField("bodyText", e.target.value)}
          placeholder="Main body content"
          rows={5}
          className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">CTA Text</Label>
          <Input
            value={form.ctaText}
            onChange={(e) => setField("ctaText", e.target.value)}
            placeholder="e.g. Yes, I want this!"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Decline Text</Label>
          <Input
            value={form.declineText}
            onChange={(e) => setField("declineText", e.target.value)}
            placeholder="e.g. No thanks, I'll pass"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">Original Price (cents)</Label>
          <Input
            type="number"
            value={form.originalPriceCents}
            onChange={(e) => setField("originalPriceCents", e.target.value)}
            placeholder="e.g. 9700"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Sale Price (cents)</Label>
          <Input
            type="number"
            value={form.salePriceCents}
            onChange={(e) => setField("salePriceCents", e.target.value)}
            placeholder="e.g. 4700"
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">Hero Image URL</Label>
          <Input
            value={form.heroImageUrl}
            onChange={(e) => setField("heroImageUrl", e.target.value)}
            placeholder="https://..."
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Video URL</Label>
          <Input
            value={form.videoUrl}
            onChange={(e) => setField("videoUrl", e.target.value)}
            placeholder="https://..."
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Senja Widget ID</Label>
        <Input
          value={form.senjaWidgetId}
          onChange={(e) => setField("senjaWidgetId", e.target.value)}
          placeholder="Senja embed widget ID"
          className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Value Stack Items</Label>
        <ValueStackEditor
          items={form.valueStackItems}
          onChange={(items) => setField("valueStackItems", items)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">FAQ Items</Label>
        <FaqEditor
          items={form.faqItems}
          onChange={(items) => setField("faqItems", items)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Page"}
        </Button>
      </div>
    </div>
  );
}

export default function FunnelPageEditor() {
  const [activeSlug, setActiveSlug] = useState<PageSlug>("sales");

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100">Funnel Page Editor</h1>
          <p className="mt-1 text-sm text-slate-400">
            Edit content for each page in your funnel.
          </p>
        </div>

        <Tabs
          value={activeSlug}
          onValueChange={(v) => setActiveSlug(v as PageSlug)}
          className="space-y-6"
        >
          <TabsList className="bg-slate-800 border border-slate-700">
            {PAGE_SLUGS.map((slug) => (
              <TabsTrigger
                key={slug}
                value={slug}
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 text-slate-400 capitalize"
              >
                {slug}
              </TabsTrigger>
            ))}
          </TabsList>

          {PAGE_SLUGS.map((slug) => (
            <TabsContent key={slug} value={slug}>
              <PageEditorPanel slug={slug} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
