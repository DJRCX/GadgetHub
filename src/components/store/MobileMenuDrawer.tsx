"use client";

import Link from "next/link";
import { useUiStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { X, Home, Package, Info, Phone, LogIn, Tags, UserRound, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryRepository } from "@/lib/services/repositories";
import { useAuthStore } from "@/store/auth";

export function MobileMenuDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore();
  const { customerName, logoutCustomer } = useAuthStore();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryRepository.getAll().catch(() => []),
  });
  const activeCategories = categories.filter(category => category.isActive !== false);

  if (!mobileMenuOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-[#05050F] text-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-r border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-xl font-black text-white tracking-tight">GADGET<span className="text-accent">HUB</span></span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          <nav className="space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5 text-muted-foreground" />
              Home
            </Link>
            <Link 
              href="/products" 
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Package className="w-5 h-5 text-muted-foreground" />
              All Products
            </Link>
            <Link 
              href="/orders" 
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="w-5 h-5 text-muted-foreground" />
              My Orders
            </Link>
          </nav>

          {activeCategories.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">Categories</h4>
              <nav className="space-y-1">
                {activeCategories.map(category => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Tags className="w-4 h-4 text-muted-foreground" />
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">Contact Us</h4>
            <div className="px-3 space-y-3">
              <a href="tel:+8801700000000" className="flex items-center gap-3 text-sm font-medium text-slate-200 hover:text-white">
                <Phone className="w-5 h-5 text-muted-foreground" />
                +880 1700-000000
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            {customerName ? (
              <button
                onClick={() => {
                  logoutCustomer();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 text-muted-foreground" />
                Sign Out ({customerName})
              </button>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound className="w-5 h-5 text-muted-foreground" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <Link 
            href="/admin"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Admin Login
          </Link>
        </div>
      </div>
    </>
  );
}
