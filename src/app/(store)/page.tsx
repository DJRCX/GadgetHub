"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { productService } from "@/lib/services/productService";
import { bannerRepository } from "@/lib/services/repositories";
import { Banner } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonGrid } from "@/components/shared/SkeletonGrid";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 420, damping: 26, mass: 0.9, bounce: 0.22 },
  },
};

const normalizeBannerPosition = (position?: string): Banner["position"] => {
  if (position === "hero-side" || position === "sidebar") return "hero-side";
  return "hero-main";
};

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
  });

  const { data: banners = [], isLoading: isLoadingBanners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => bannerRepository.getAll().catch(() => []),
  });

  const featuredProducts = products?.filter(p => p?.isFeatured).slice(0, 6) || [];
  const latestProducts = products?.slice(0, 12) || [];
  const activeBanners = useMemo(
    () => [...(banners?.filter(b => b?.isActive) || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [banners]
  );
  const heroSlides = activeBanners.filter(b => normalizeBannerPosition(b?.position) === "hero-main");
  const sideBanners = activeBanners.filter(b => normalizeBannerPosition(b?.position) === "hero-side");
  const activeSlideIndex = heroSlides.length > 0 ? activeSlide % heroSlides.length : 0;
  const heroBanner = heroSlides[activeSlideIndex] || heroSlides[0];

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  const goToPreviousSlide = () => {
    if (heroSlides.length <= 1) return;
    setActiveSlide(current => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    if (heroSlides.length <= 1) return;
    setActiveSlide(current => (current + 1) % heroSlides.length);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full bg-background border-b border-border">
        {isLoadingBanners ? (
          <div className="container mx-auto px-4 py-6">
            <div className="h-[440px] animate-pulse bg-muted/30" />
          </div>
        ) : heroBanner ? (
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 lg:gap-6">
              <div className="relative min-h-[420px] md:min-h-[500px] overflow-hidden rounded-2xl border border-border bg-card">
                <div className="absolute inset-0">
                  <Image
                    src={heroBanner.imageUrl}
                    alt={heroBanner.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 1024px) 70vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
                </div>

                <motion.div
                  key={heroBanner.id}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="relative z-10 flex min-h-[420px] md:min-h-[500px] max-w-2xl flex-col justify-end p-6 md:p-10 lg:p-12 text-white"
                >
                  <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                    {heroBanner.title}
                  </motion.h1>
                  {heroBanner.subtitle && (
                    <motion.p variants={itemVariants} className="mt-5 text-base md:text-lg text-white/85 font-medium max-w-xl">
                      {heroBanner.subtitle}
                    </motion.p>
                  )}
                  {heroBanner.linkUrl && (
                    <motion.div variants={itemVariants} className="pt-7">
                      <Link
                        href={heroBanner.linkUrl}
                        className={cn(buttonVariants({ size: "lg" }), "font-bold px-5 bg-white text-slate-950 hover:bg-white/90")}
                      >
                        {heroBanner.ctaLabel || "Shop Now"} <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>

                {heroSlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous banner"
                      onClick={goToPreviousSlide}
                      className="absolute left-4 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/25 text-white backdrop-blur hover:bg-black/40 md:flex"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next banner"
                      onClick={goToNextSlide}
                      className="absolute right-4 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/25 text-white backdrop-blur hover:bg-black/40 md:flex"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-5 right-5 z-20 flex gap-2">
                      {heroSlides.map((slide, index) => (
                        <button
                          key={slide.id}
                          type="button"
                          aria-label={`Show banner ${index + 1}`}
                          onClick={() => setActiveSlide(index)}
                          className={cn(
                            "h-2.5 transition-all bg-white/50",
                            index === activeSlideIndex ? "w-8 bg-white" : "w-2.5 hover:bg-white/80"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {sideBanners.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {sideBanners.map((banner) => (
                    <Link
                      key={banner.id}
                      href={banner.linkUrl || "/products"}
                      className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-border bg-card"
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <h2 className="text-xl font-black tracking-tight">{banner.title}</h2>
                        {banner.subtitle && <p className="mt-2 text-sm text-white/80 line-clamp-2">{banner.subtitle}</p>}
                        <span className="mt-4 inline-flex items-center text-sm font-bold">
                          {banner.ctaLabel || "Explore"} <ArrowRight className="ml-1 w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">Welcome to GadgetHub</h1>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-transparent"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Featured Products</h2>
              <div className="h-[2px] w-20 bg-primary mt-3"></div>
            </div>
            <Link href="/products?filter=featured" className="text-primary font-medium hover:underline items-center gap-1 hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {isLoadingProducts ? (
            <SkeletonGrid count={6} />
          ) : featuredProducts.length > 0 ? (
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr items-stretch">
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants} className="h-full">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No featured products found.</div>
          )}

          <motion.div variants={itemVariants} className="mt-8 text-center sm:hidden">
            <Link
              href="/products?filter=featured"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              View All Featured
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-secondary/30 border-t border-border"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">New Arrivals</h2>
              <div className="h-[2px] w-20 bg-primary mt-3"></div>
            </div>
            <Link href="/products" className="text-primary font-medium hover:underline items-center gap-1 hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {isLoadingProducts ? (
            <SkeletonGrid count={12} />
          ) : latestProducts.length > 0 ? (
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr items-stretch">
              {latestProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants} className="h-full">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No products found.</div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
