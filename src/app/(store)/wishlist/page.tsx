"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/lib/services/productService";
import { useUiStore } from "@/store/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonGrid } from "@/components/shared/SkeletonGrid";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";

export default function WishlistPage() {
  const wishlistItems = useUiStore((s) => s.wishlistItems);
  const toggleWishlist = useUiStore((s) => s.toggleWishlist);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll().catch(() => []),
  });

  const wishlistedProducts = useMemo(() => {
    if (!wishlistItems.length) return [];
    const set = new Set(wishlistItems);
    return products.filter((p) => set.has(p.id));
  }, [products, wishlistItems]);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">Wishlist</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {wishlistItems.length} saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={() => wishlistItems.forEach((id) => toggleWishlist(id))}
            >
              Clear all
            </Button>
          )}
        </div>

        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr items-stretch">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="mx-auto size-12 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground">
              <HeartOff className="w-6 h-6" />
            </div>
            <h2 className="mt-5 text-xl font-black tracking-tight">Your wishlist is empty</h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">
              Tap the heart icon on any product to save it here.
            </p>
            <div className="mt-6">
              <Link href="/products">
                <Button>Browse products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
