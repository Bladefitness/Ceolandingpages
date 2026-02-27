import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  priceInCents: z.coerce.number().int().min(0, "Price must be 0 or greater"),
  type: z.enum(["course", "vault", "session"]),
  installmentCount: z.coerce.number().int().min(1).optional().or(z.literal("")),
  installmentAmountInCents: z.coerce.number().int().min(0).optional().or(z.literal("")),
  installmentIntervalDays: z.coerce.number().int().min(1).optional().or(z.literal("")),
  whopPlanId: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCentsToDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatInstallments(
  count: number | null | undefined,
  amountCents: number | null | undefined
): string {
  if (!count || !amountCents) return "—";
  return `${count}x ${formatCentsToDollars(amountCents)}`;
}

// ---------------------------------------------------------------------------
// Types (inferred from trpc output — kept loose for compatibility)
// ---------------------------------------------------------------------------

type Product = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  priceInCents: number;
  type: string;
  installmentCount?: number | null;
  installmentAmountInCents?: number | null;
  installmentIntervalDays?: number | null;
  whopPlanId?: string | null;
  active: number;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FunnelProducts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const utils = trpc.useUtils();

  const { data: products, isLoading } = trpc.funnelAdmin.products.list.useQuery();

  const createProduct = trpc.funnelAdmin.products.create.useMutation({
    onSuccess: () => {
      utils.funnelAdmin.products.list.invalidate();
      closeDialog();
    },
  });

  const updateProduct = trpc.funnelAdmin.products.update.useMutation({
    onSuccess: () => {
      utils.funnelAdmin.products.list.invalidate();
      closeDialog();
    },
  });

  const toggleActive = trpc.funnelAdmin.products.toggleActive.useMutation({
    onSuccess: () => {
      utils.funnelAdmin.products.list.invalidate();
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      priceInCents: 0,
      type: "course",
      installmentCount: "",
      installmentAmountInCents: "",
      installmentIntervalDays: "",
      whopPlanId: "",
    },
  });

  const watchedPrice = form.watch("priceInCents");

  function openCreateDialog() {
    setEditingProduct(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      priceInCents: 0,
      type: "course",
      installmentCount: "",
      installmentAmountInCents: "",
      installmentIntervalDays: "",
      whopPlanId: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      priceInCents: product.priceInCents,
      type: product.type as "course" | "vault" | "session",
      installmentCount: product.installmentCount ?? "",
      installmentAmountInCents: product.installmentAmountInCents ?? "",
      installmentIntervalDays: product.installmentIntervalDays ?? "",
      whopPlanId: product.whopPlanId ?? "",
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingProduct(null);
  }

  function onSubmit(values: ProductFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      priceInCents: values.priceInCents,
      type: values.type,
      installmentCount: values.installmentCount !== "" ? Number(values.installmentCount) : undefined,
      installmentAmountInCents: values.installmentAmountInCents !== "" ? Number(values.installmentAmountInCents) : undefined,
      installmentIntervalDays: values.installmentIntervalDays !== "" ? Number(values.installmentIntervalDays) : 30,
      whopPlanId: values.whopPlanId || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id as number, ...payload });
    } else {
      createProduct.mutate(payload);
    }
  }

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Products</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage funnel products and pricing
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-[#E5C158] hover:bg-[#E5C158]/90 text-slate-950 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              Loading products...
            </div>
          ) : !products || products.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No products yet. Click "Add Product" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Slug</TableHead>
                    <TableHead className="text-slate-300">Price</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Installments</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: Product) => (
                    <TableRow
                      key={product.id}
                      className="border-slate-700 hover:bg-slate-700/40"
                    >
                      <TableCell className="text-slate-200 font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono text-sm">
                        {product.slug}
                      </TableCell>
                      <TableCell className="text-slate-200 tabular-nums">
                        {formatCentsToDollars(product.priceInCents)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-300 capitalize"
                        >
                          {product.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 tabular-nums">
                        {formatInstallments(
                          product.installmentCount,
                          product.installmentAmountInCents
                        )}
                      </TableCell>
                      <TableCell>
                        {product.active !== 0 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/20">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleActive.mutate({ id: product.id as number })
                            }
                            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                            title={product.active !== 0 ? "Deactivate" : "Activate"}
                          >
                            {product.active !== 0 ? (
                              <ToggleRight className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Titan Course"
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="titan-course"
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Optional product description..."
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price in cents */}
              <FormField
                control={form.control}
                name="priceInCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Price (cents)
                      {watchedPrice > 0 && (
                        <span className="ml-2 text-[#E5C158] font-normal">
                          = {formatCentsToDollars(Number(watchedPrice))}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="99700"
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 tabular-nums"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="vault">Vault</SelectItem>
                        <SelectItem value="session">Session</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Installments section */}
              <div className="pt-1">
                <p className="text-sm font-medium text-slate-400 mb-3">
                  Installments (optional)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="installmentCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400 text-xs">Count</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            placeholder="3"
                            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 tabular-nums"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installmentAmountInCents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400 text-xs">Amount (cents)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            placeholder="39700"
                            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 tabular-nums"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installmentIntervalDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400 text-xs">Interval (days)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            placeholder="30"
                            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 tabular-nums"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Whop Plan ID */}
              <FormField
                control={form.control}
                name="whopPlanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Whop Plan ID{" "}
                      <span className="text-slate-500 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="plan_xxxxxxxx"
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeDialog}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#E5C158] hover:bg-[#E5C158]/90 text-slate-950 font-semibold"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
