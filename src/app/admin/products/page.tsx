"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/services/productService";
import { categoryRepository } from "@/lib/services/repositories";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { productSchema, ProductFormValues } from "@/lib/schemas/product.schema";
import { z } from "zod";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<ProductFormValues>>({
    name: "", slug: "", description: "", price: 0, stock: 0, categoryId: "",
    images: [""], isFeatured: false
  });
  const [errors, setErrors] = useState<any>({});

  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.getAll().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => productService.create({ ...data, specs: data.specs || {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDrawerOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: Partial<ProductFormValues> }) => 
      productService.update(data.id, { ...data.payload, specs: data.payload.specs || {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDrawerOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "", slug: "", description: "", price: 0, stock: 0, categoryId: "",
      images: [""], isFeatured: false
    });
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images?.length ? product.images : [""],
      isFeatured: product.isFeatured
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitized = {
        ...formData,
        images: (formData.images || []).map((s) => String(s).trim()).filter(Boolean),
      };
      const validData = productSchema.parse(sanitized);
      setErrors({});
      if (editingProduct) {
        updateMutation.mutate({ id: editingProduct.id, payload: validData });
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
      key: "images", 
      label: "Image", 
      render: (val: any) => val && val[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={val[0]} alt="Product" className="w-10 h-10 object-cover rounded" />
      ) : <div className="w-10 h-10 bg-muted rounded" />
    },
    { key: "name", label: "Product Name" },
    { key: "price", label: "Price", render: (val: any) => formatCurrency(val) },
    { key: "stock", label: "Stock" },
    { 
      key: "actions", 
      label: "Actions", 
      render: (_: any, row: any) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            if (confirm("Are you sure you want to delete this product?")) {
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Products</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoadingProducts}
        />
      </div>

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input 
              value={formData.name || ""} 
              onChange={e => setFormData((prev) => ({
                ...prev,
                name: e.target.value,
                slug: prev.slug === slugify(prev.name || "") || !prev.slug ? slugify(e.target.value) : prev.slug,
              }))} 
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input 
              value={formData.slug || ""} 
              onChange={e => setFormData({...formData, slug: slugify(e.target.value)})}
              placeholder="samsung-galaxy-s24-ultra"
            />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea 
              value={formData.description || ""} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Regular Price (BDT) *</Label>
              <Input 
                type="number" 
                value={formData.price || 0} 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label>Sale Price (BDT)</Label>
              <Input 
                type="number" 
                value={formData.salePrice || ""} 
                onChange={e => setFormData({...formData, salePrice: e.target.value ? Number(e.target.value) : undefined})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input 
                type="number" 
                value={formData.stock || 0} 
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
              />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.categoryId || ""}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Image URLs *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData((prev) => ({
                  ...prev,
                  images: [...(prev.images?.length ? prev.images : [""]), ""],
                }))}
              >
                <Plus className="w-4 h-4 mr-2" /> Add image
              </Button>
            </div>

            <div className="space-y-2">
              {(formData.images?.length ? formData.images : [""]).map((val, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={val || ""}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const images = [...(prev.images?.length ? prev.images : [""])]
                        images[idx] = e.target.value;
                        return { ...prev, images };
                      })
                    }
                    placeholder={idx === 0 ? "https://example.com/image.jpg" : "https://example.com/another.jpg"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFormData((prev) => {
                        const current = prev.images?.length ? prev.images : [""];
                        const images = current.filter((_, i) => i !== idx);
                        return { ...prev, images: images.length ? images : [""] };
                      })
                    }
                    aria-label="Remove image"
                    disabled={(formData.images?.length || 1) <= 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="isFeatured" 
              checked={formData.isFeatured || false} 
              onCheckedChange={checked => setFormData({...formData, isFeatured: checked})}
            />
            <Label htmlFor="isFeatured">Featured Product</Label>
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
