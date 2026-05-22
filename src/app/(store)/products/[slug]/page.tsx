"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { productService } from "@/lib/services/productService";
import { formatCurrency } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscountBadge } from "@/components/shared/DiscountBadge";
import { EMIBadge } from "@/components/shared/EMIBadge";
import { SavingsLabel } from "@/components/shared/SavingsLabel";
import { Heart, ShoppingCart, ShieldCheck, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState, use } from "react";
import { notFound } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, wishlistItems } = useUiStore();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const product = products?.find(p => p?.slug === slug);

  if (!product && !isLoading) {
    notFound();
  }

  if (!product) return null;

  const isWishlisted = wishlistItems.includes(product.id);
  const priceToUse = product.salePrice || product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: priceToUse,
      quantity,
      image: product.images[0] || "",
      stock: product.stock,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16"
        >
          {/* Left: Image Stream */}
          <div className="space-y-6">
            {/* Main Image */}
            <motion.div variants={itemVariants} className="relative aspect-[4/5] bg-white border border-border overflow-hidden">
              {product.images[activeImage] && (
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8 mix-blend-multiply"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              )}
              <div className="absolute top-4 left-4">
                <DiscountBadge percent={product.discountPercent} className="text-sm px-3 py-1" />
              </div>
            </motion.div>

            {/* Thumbnail Stream */}
            {product.images.length > 1 && (
              <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 border overflow-hidden flex-shrink-0 bg-white transition-colors ${activeImage === idx ? 'border-primary' : 'border-border hover:border-zinc-400'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2 mix-blend-multiply" sizes="80px" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Description */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-border">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Key Features</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description}
              </div>
            </motion.div>
          </div>

          {/* Right: Sticky Buybox */}
          <motion.div variants={itemVariants} className="lg:sticky lg:top-8 lg:self-start space-y-8">
            {/* Huge Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Code: <span className="font-medium text-foreground">{product.id.slice(0, 8).toUpperCase()}</span></span>
                <span className="w-1 h-1 bg-border"></span>
                <span className={`${product.stock > 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6 border border-border bg-card">
              <div className="flex flex-wrap items-end gap-4 mb-2">
                <span className="text-4xl font-black text-primary tracking-tight">
                  {formatCurrency(priceToUse)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-lg text-muted-foreground line-through font-medium">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              <SavingsLabel regularPrice={product.price} salePrice={product.salePrice} className="text-sm mb-3" />
              <EMIBadge />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center border border-border bg-white h-12 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  disabled={quantity <= 1 || product.stock === 0}
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {product.stock === 0 ? 0 : quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  +
                </button>
              </div>

              <div className="flex gap-3">
                <motion.div
                  whileTap={product.stock > 0 ? { scale: 0.97 } : undefined}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-bold"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className={`w-5 h-5 mr-2 transition-transform ${addedToCart ? "scale-110" : ""}`} />
                    {addedToCart ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </motion.div>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Warranty & Return */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 border border-border">
                <ShieldCheck className="w-7 h-7 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">1 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Official Brand</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border">
                <RotateCcw className="w-7 h-7 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">3 Days Return</p>
                  <p className="text-xs text-muted-foreground">If defective</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Specs Section */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 pt-12 border-t border-border"
          >
            <h2 className="text-2xl font-black tracking-tight mb-8">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex py-4 border-b border-border/50">
                  <span className="w-1/3 text-muted-foreground text-sm font-medium">{key}</span>
                  <span className="w-2/3 text-foreground text-sm font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
