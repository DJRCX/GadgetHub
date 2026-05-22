"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryRepository } from "@/lib/services/repositories";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true)
});

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: "", slug: "", imageUrl: "", isActive: true
  });
  const [errors, setErrors] = useState<any>({});

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.getAll().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDrawerOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: any }) => categoryRepository.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDrawerOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", imageUrl: "", isActive: true });
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl || "",
      isActive: category.isActive !== false
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      name: newName,
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(newName) : prev.slug
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validData = categorySchema.parse(formData);
      setErrors({});
      if (editingCategory) {
        updateMutation.mutate({ id: editingCategory.id, payload: validData });
      } else {
        createMutation.mutate(validData);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const columns = [
    { 
      key: "imageUrl", 
      label: "Image", 
      render: (val: any) => val ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={val} alt="Category" className="w-10 h-10 object-cover rounded" />
      ) : <div className="w-10 h-10 bg-muted rounded" />
    },
    { key: "name", label: "Category Name" },
    { key: "slug", label: "Slug", render: (val: any) => <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{val}</span> },
    { 
      key: "isActive", 
      label: "Status", 
      render: (val: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${val ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: "actions", 
      label: "Actions", 
      render: (_: any, row: any) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            if (confirm("Are you sure you want to delete this category?")) {
              deleteMutation.mutate(row.id);
            }
          }}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Categories</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
        />
      </div>

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category Name *</Label>
            <Input 
              value={formData.name || ""} 
              onChange={handleNameChange} 
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input 
              value={formData.slug || ""} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
            />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input 
              value={formData.imageUrl || ""} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="isActive" 
              checked={formData.isActive} 
              onCheckedChange={checked => setFormData({...formData, isActive: checked})}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
