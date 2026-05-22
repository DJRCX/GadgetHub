"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, LogOut, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUiStore } from "@/store/ui";
import { useCartStore } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { categoryRepository } from "@/lib/services/repositories";
import { useAuthStore } from "@/store/auth";

export function StoreHeader() {
  const { setCartOpen, wishlistItems, setMobileMenuOpen } = useUiStore();
  const { items } = useCartStore();
  const { customerName, logoutCustomer } = useAuthStore();
  const hasMounted = useHasMounted();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryRepository.getAll().catch(() => []),
  });

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const activeCategories = categories.filter(category => category.isActive !== false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-black text-foreground tracking-tighter">GADGET<span className="text-primary">HUB</span></span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl px-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-10 pl-4 pr-10 bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {hasMounted && customerName ? (
            <>
              <span className="hidden lg:flex items-center gap-1 text-xs font-semibold text-muted-foreground px-2">
                <UserRound className="w-3.5 h-3.5" />
                {customerName}
              </span>
              <button
                onClick={logoutCustomer}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link href="/signin" className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Sign in">
              <UserRound className="w-5 h-5" />
            </Link>
          )}
          <Link href="/wishlist" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            {hasMounted && wishlistItems.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {hasMounted && cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {activeCategories.length > 0 && (
        <div className="hidden md:block border-t border-border bg-background/95">
          <nav className="container mx-auto px-4 h-11 flex items-center justify-center gap-1 overflow-x-auto">
            <Link
              href="/products"
              className="shrink-0 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              All Products
            </Link>
            {activeCategories.map(category => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="shrink-0 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
