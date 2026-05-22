"use client";

import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const { cartOpen, setCartOpen } = useUiStore();
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 sm:p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your cart is empty</p>
              <Button variant="outline" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="relative w-20 h-20 bg-white rounded border border-border flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium line-clamp-2 text-text-primary leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-bold text-accent">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center border border-border rounded-md bg-background">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-primary disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-primary disabled:opacity-50"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-border bg-muted/20">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-text-secondary">Subtotal</span>
              <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
