"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { productService } from "@/lib/services/productService";
import { categoryRepository } from "@/lib/services/repositories";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonGrid } from "@/components/shared/SkeletonGrid";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageFallback() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <div className="h-10 w-64 bg-muted animate-pulse" />
          <div className="h-4 w-28 bg-muted animate-pulse mt-3" />
        </div>
        <SkeletonGrid count={12} />
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.getAll().catch(() => []),
  });

  const selectedCategory = searchParams.get("category") || "all";
  const updateCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    window.history.pushState(null, "", params.toString() ? `/products?${params.toString()}` : "/products");
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p?.categoryId === selectedCategory);
  const activeCategories = categories.filter(category => category.isActive !== false);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">All Products</h1>
            <p className="text-muted-foreground mt-2 text-sm">{filteredProducts.length} results</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-sm font-medium hover:border-zinc-400 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-sm font-medium hover:border-zinc-400 transition-colors">
              Sort by: Recommended <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full md:w-64 shrink-0 space-y-8 hidden md:block"
          >
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-border">Categories</h3>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-5 bg-muted animate-pulse" />)}
                </div>
              ) : (
                <ul className="space-y-2">
                  <li>
                      <button
                      onClick={() => updateCategory("all")}
                      className={`text-sm transition-colors ${selectedCategory === "all" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {activeCategories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => updateCategory(category.id)}
                        className={`text-sm transition-colors text-left ${selectedCategory === category.id ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <SkeletonGrid count={12} />
            ) : filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr items-stretch"
              >
                {filteredProducts.map(product => (
                  <motion.div key={product.id} variants={itemVariants} className="h-full">
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-card border border-border">
                <p className="text-muted-foreground">No products found in this category.</p>
                <button
                  onClick={() => updateCategory("all")}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
