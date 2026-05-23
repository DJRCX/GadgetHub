"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerRepository } from "@/lib/services/repositories";
import { Banner } from "@/lib/types";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { z } from "zod";

const bannerPlacements = [
  { value: "hero-main", label: "Main Hero Slide" },
  { value: "hero-side", label: "Side Hero Banner" },
] as const;

const bannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  imageUrl: z.string().refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Must be a valid URL or local image path"
  ),
  linkUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  position: z.enum(["hero-main", "hero-side"]),
  sortOrder: z.coerce.number().int().min(0, "Order must be 0 or higher").default(0),
  isActive: z.boolean().default(true),
});

type BannerFormData = {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  ctaLabel: string;
  position: Banner["position"];
  sortOrder: number;
  isActive: boolean;
};

const normalizeBannerPosition = (position?: string): Banner["position"] => {
  if (position === "hero-side" || position === "sidebar") return "hero-side";
  return "hero-main";
};

const emptyForm: BannerFormData = {
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  ctaLabel: "Shop Now",
  position: "hero-main",
  sortOrder: 0,
  isActive: true,
};

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannerRepository.getAll().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Banner, "id">) => bannerRepository.create({ ...data, id: `banner-${Date.now()}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<Banner> }) => bannerRepository.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannerRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const resetForm = () => {
    setEditingBanner(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      ctaLabel: banner.ctaLabel || "Shop Now",
      position: normalizeBannerPosition(banner.position),
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive !== false,
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validData = bannerSchema.parse(formData);
      const payload: Omit<Banner, "id"> = {
        ...validData,
        subtitle: validData.subtitle || undefined,
        linkUrl: validData.linkUrl || undefined,
        ctaLabel: validData.ctaLabel || undefined,
        language: "en",
      };

      setErrors({});
      if (editingBanner) {
        updateMutation.mutate({ id: editingBanner.id, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const sortedBanners = [...banners].sort((a, b) => {
    const positionSort = normalizeBannerPosition(a.position).localeCompare(normalizeBannerPosition(b.position));
    if (positionSort !== 0) return positionSort;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (val: unknown, row: Banner) =>
        val ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={String(val)} alt={row.title} className="w-20 h-10 object-cover rounded" />
        ) : (
          <div className="w-20 h-10 bg-muted rounded" />
        ),
    },
    { key: "title", label: "Title" },
    {
      key: "position",
      label: "Placement",
      render: (val: unknown) => bannerPlacements.find((item) => item.value === normalizeBannerPosition(String(val)))?.label,
    },
    { key: "sortOrder", label: "Order", render: (val: unknown) => Number(val || 0) },
    {
      key: "isActive",
      label: "Status",
      render: (val: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${val ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: Banner) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Delete this banner permanently?")) {
                deleteMutation.mutate(row.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Banners</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <DataTable columns={columns} data={sortedBanners} isLoading={isLoading} />
      </div>

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingBanner ? "Edit Banner" : "Add New Banner"}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={formData.subtitle || ""} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Image URL *</Label>
            <Input
              value={formData.imageUrl || ""}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA URL</Label>
              <Input
                value={formData.linkUrl || ""}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="/products"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input
                value={formData.ctaLabel || ""}
                onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                placeholder="Shop Now"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Placement *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.position || "hero-main"}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as Banner["position"] })}
              >
                {bannerPlacements.map((placement) => (
                  <option key={placement.value} value={placement.value}>
                    {placement.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                min={0}
                value={formData.sortOrder ?? 0}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              />
              {errors.sortOrder && <p className="text-xs text-red-500">{errors.sortOrder}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isActive"
              checked={!!formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
