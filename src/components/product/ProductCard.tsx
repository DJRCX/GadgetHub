"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { DiscountBadge } from "../shared/DiscountBadge";
import { SavingsLabel } from "../shared/SavingsLabel";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { wishlistItems, toggleWishlist } = useUiStore();
  const isWishlisted = wishlistItems.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.images[0] || "",
      stock: product.stock,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.8 }}
      className="group relative flex h-full flex-col bg-card overflow-hidden rounded-2xl border border-zinc-200 hover:border-primary transition-colors will-change-transform transform-gpu"
    >
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0" />

      <div className="relative aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-6 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-zinc-400 text-sm">No Image</div>
        )}

        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <DiscountBadge percent={product.discountPercent} />
        </div>

        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-muted-foreground hover:text-primary transition-colors pointer-events-auto"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
        </button>

        {/* Sliding Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full pointer-events-auto"
            variant={product.stock === 0 ? "secondary" : "default"}
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow z-10 pointer-events-none">
        <h3 className="min-h-10 text-sm font-medium line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto min-h-14">
          <div className="flex items-end gap-2 flex-wrap">
            <span className="text-base font-bold text-primary">
              {formatCurrency(product.salePrice || product.price)}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs text-muted-foreground line-through mb-0.5">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <SavingsLabel
            regularPrice={product.price}
            salePrice={product.salePrice}
          />
        </div>
      </div>
    </motion.div>
  );
}
