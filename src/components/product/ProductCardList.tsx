"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";

interface ProductCardListProps {
  product: Product;
}

export function ProductCardList({ product }: ProductCardListProps) {
  return (
    <div className="group relative flex items-center gap-4 p-3 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0" />
      
      {/* Left: Square Image */}
      <div className="relative w-20 h-20 bg-white rounded flex-shrink-0 flex items-center justify-center border border-border/50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2 mix-blend-multiply"
            sizes="80px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">No Img</div>
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-center py-1 z-10 pointer-events-none">
        <h3 className="text-sm font-medium line-clamp-2 text-text-primary group-hover:text-primary transition-colors leading-snug mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-accent">
            {formatCurrency(product.salePrice || product.price)}
          </span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-xs text-text-secondary line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
