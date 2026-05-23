"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useAuthStore } from "@/store/auth";
import { orderService } from "@/lib/services/orderService";
import { formatCurrency } from "@/lib/utils/currency";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, ChevronRight, CreditCard, Info, MapPin, Minus, Package, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { checkoutShippingSchema, CheckoutShippingFormValues } from "@/lib/schemas/checkout.schema";
import { z } from "zod";

const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, updateQuantity, removeItem } = useCartStore();
  const { customerName, customerEmail } = useAuthStore();
  const { currentStep, setStep, shipping, setShipping, paymentMethod, setPaymentMethod, reset } = useCheckoutStore();
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof CheckoutShippingFormValues, string>>>({});
  const [paymentError, setPaymentError] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [localShipping, setLocalShipping] = useState<Partial<CheckoutShippingFormValues>>(shipping || {
    customerName: customerName || "", phone: "", email: customerEmail || "", address: "", city: "", postalCode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 100;
  const total = subtotal + shippingCost;

  const effectiveStep = currentStep === 4 && items.length > 0 ? 1 : currentStep;

  useEffect(() => {
    if (items.length > 0 && currentStep === 4) {
      setStep(1);
    }
  }, [items.length, currentStep, setStep]);

  if (items.length === 0 && effectiveStep !== 4) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Package className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any products yet.</p>
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validData = checkoutShippingSchema.parse(localShipping);
      setShipping(validData);
      setShippingErrors({});
      setStep(3);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: any = {};
        err.issues.forEach(e => {
          if (e.path[0]) errors[e.path[0]] = e.message;
        });
        setShippingErrors(errors);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!shipping || !paymentMethod) return;
    const requiresTransactionId = paymentMethod === "bKash" || paymentMethod === "Nagad" || paymentMethod === "Rocket";
    if (requiresTransactionId && !transactionId.trim()) {
      setPaymentError(`Transaction ID is required for ${paymentMethod} payment.`);
      return;
    }

    setPaymentError("");
    setIsSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
        name: i.name,
        image: i.image
      }));

      await orderService.create({
        customerName: shipping.customerName,
        phone: shipping.phone,
        email: shipping.email || undefined,
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
        subtotal,
        shippingFee: shippingCost,
        total,
        status: 'Pending',
        paymentMethod,
        transactionId: requiresTransactionId ? transactionId.trim() : undefined,
        items: orderItems
      });

      clearCart();
      setStep(4);
      setTransactionId("");
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiresTransactionId = paymentMethod === "bKash" || paymentMethod === "Nagad" || paymentMethod === "Rocket";
  const canPlaceOrder = Boolean(paymentMethod) && (!requiresTransactionId || Boolean(transactionId.trim()));

  return (
    <div className="bg-muted/10 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-tight">Checkout</h1>
        
        <StepIndicator steps={STEPS} currentStep={effectiveStep} />

        <div className={`grid grid-cols-1 gap-8 mt-12 ${effectiveStep === 4 ? "" : "lg:grid-cols-3"}`}>
           
          <div className={`${effectiveStep === 4 ? "" : "lg:col-span-2"} space-y-6`}>
            {/* STEP 1: CART REVIEW */}
            {effectiveStep === 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5" /> Order Summary
                  </h2>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.productId} className="flex flex-col sm:flex-row gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="relative w-20 h-20 bg-muted/20 rounded flex-shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" loading="lazy" />}
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-medium line-clamp-2">{item.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
                            <div className="flex items-center border border-border rounded-md bg-background">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-2 text-muted-foreground hover:text-primary disabled:opacity-50"
                                disabled={item.quantity <= 1}
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-2 text-muted-foreground hover:text-primary disabled:opacity-50"
                                disabled={item.quantity >= item.stock}
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="block text-xs text-muted-foreground">{formatCurrency(item.price)} each</span>
                              <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button size="lg" onClick={() => setStep(2)}>
                      Continue to Shipping <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: SHIPPING INFO */}
            {effectiveStep === 2 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Shipping Address
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input 
                          value={localShipping.customerName || ""} 
                          onChange={e => setLocalShipping({...localShipping, customerName: e.target.value})} 
                        />
                        {shippingErrors.customerName && <p className="text-xs text-red-500">{shippingErrors.customerName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input 
                          placeholder="+8801700000000"
                          value={localShipping.phone || ""} 
                          onChange={e => setLocalShipping({...localShipping, phone: e.target.value})} 
                        />
                        {shippingErrors.phone && <p className="text-xs text-red-500">{shippingErrors.phone}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email Address (Optional)</Label>
                      <Input 
                        type="email"
                        value={localShipping.email || ""} 
                        onChange={e => setLocalShipping({...localShipping, email: e.target.value})} 
                      />
                      {shippingErrors.email && <p className="text-xs text-red-500">{shippingErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Detailed Address *</Label>
                      <Input 
                        placeholder="House/Apt, Street"
                        value={localShipping.address || ""} 
                        onChange={e => setLocalShipping({...localShipping, address: e.target.value})} 
                      />
                      {shippingErrors.address && <p className="text-xs text-red-500">{shippingErrors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input 
                          value={localShipping.city || ""} 
                          onChange={e => setLocalShipping({...localShipping, city: e.target.value})} 
                        />
                        {shippingErrors.city && <p className="text-xs text-red-500">{shippingErrors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code *</Label>
                        <Input 
                          value={localShipping.postalCode || ""} 
                          onChange={e => setLocalShipping({...localShipping, postalCode: e.target.value})} 
                        />
                        {shippingErrors.postalCode && <p className="text-xs text-red-500">{shippingErrors.postalCode}</p>}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between pt-4 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button type="submit">
                        Continue to Payment <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {effectiveStep === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h2>
                  <RadioGroup 
                    value={paymentMethod || ""} 
                    onValueChange={(val: any) => {
                      setPaymentMethod(val);
                      setPaymentError("");
                      if (val === "COD") setTransactionId("");
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 border border-border p-4 rounded-md hover:bg-muted/20 cursor-pointer">
                      <RadioGroupItem value="COD" id="COD" />
                      <Label htmlFor="COD" className="flex-1 cursor-pointer font-bold">Cash on Delivery (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-3 border border-border p-4 rounded-md hover:bg-muted/20 cursor-pointer">
                      <RadioGroupItem value="bKash" id="bKash" />
                      <Label htmlFor="bKash" className="flex-1 cursor-pointer font-bold">bKash Mobile Payment</Label>
                    </div>
                    <div className="flex items-center space-x-3 border border-border p-4 rounded-md hover:bg-muted/20 cursor-pointer">
                      <RadioGroupItem value="Nagad" id="Nagad" />
                      <Label htmlFor="Nagad" className="flex-1 cursor-pointer font-bold">Nagad Mobile Payment</Label>
                    </div>
                    <div className="flex items-center space-x-3 border border-border p-4 rounded-md hover:bg-muted/20 cursor-pointer">
                      <RadioGroupItem value="Rocket" id="Rocket" />
                      <Label htmlFor="Rocket" className="flex-1 cursor-pointer font-bold">Rocket Mobile Payment</Label>
                    </div>
                  </RadioGroup>

                  {(paymentMethod === "bKash" || paymentMethod === "Nagad" || paymentMethod === "Rocket") && (
                    <div className="mt-6 space-y-3 rounded-lg border border-border bg-amber-50/50 p-4">
                      <div className="flex items-start gap-2 text-amber-700">
                        <Info className="size-4 mt-0.5 shrink-0" />
                        <p className="text-xs font-medium">
                          After sending the payment, enter the transaction ID below.
                          Your order will be verified within <strong>12–24 hours</strong>.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Transaction ID *</Label>
                        <Input
                          placeholder={`e.g. TRX123ABC`}
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the reference / transaction ID from your {paymentMethod === "bKash" ? "bKash" : paymentMethod === "Nagad" ? "Nagad" : "Rocket"} app confirmation.
                        </p>
                        {paymentError && <p className="text-xs text-red-500 font-medium">{paymentError}</p>}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="mt-6 flex items-start gap-2 text-muted-foreground rounded-lg border border-border p-4">
                      <Info className="size-4 mt-0.5 shrink-0" />
                      <p className="text-xs">
                        Pay when your package arrives. No advance payment needed.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setStep(2)} className="order-2 sm:order-1">Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={!canPlaceOrder || isSubmitting} size="lg" className="order-1 sm:order-2">
                      {isSubmitting ? "Processing..." : "Place Order"} <CheckCircle2 className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 4: CONFIRMATION */}
            {effectiveStep === 4 && (
              <Card className="text-center py-12 px-6 mx-auto w-full max-w-xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-black mb-4">Order Placed!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>

                {paymentMethod !== "COD" && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-8 mx-auto max-w-sm">
                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-semibold mb-1">Payment Validation in Progress</p>
                      <p>
                        Your transaction will be verified within <strong>12–24 hours</strong>.
                        Once confirmed, your order status will update. You can track it from your orders page.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={() => { reset(); router.push('/orders'); }} variant="outline">
                    View Orders
                  </Button>
                  <Button onClick={() => { reset(); router.push('/'); }}>
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          {effectiveStep !== 4 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Order Total</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping (Flat)</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-4">
                    <span>Total</span>
                    <span className="text-accent">{formatCurrency(total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
