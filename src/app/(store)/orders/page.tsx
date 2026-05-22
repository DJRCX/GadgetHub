"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/services/orderService";
import { formatCurrency } from "@/lib/utils/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function OrderHistoryPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getAll().catch(() => []), 
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return "bg-amber-100 text-amber-800";
      case 'Processing': return "bg-blue-100 text-blue-800";
      case 'Shipped': return "bg-indigo-100 text-indigo-800";
      case 'Delivered': return "bg-green-100 text-green-800";
      case 'Cancelled': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="min-h-screen p-8 text-center">Loading orders...</div>;
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black mb-8 uppercase tracking-tight">My Orders</h1>
        
        {sortedOrders.length === 0 ? (
          <Card className="py-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders.</p>
            <Link href="/products" className={buttonVariants()}>Start Shopping</Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID: <span className="font-bold text-slate-900">{order.id}</span></p>
                    <p className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <span className="font-black text-lg">{formatCurrency(order.total)}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Items ({order.items.length})</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="truncate pr-4"><span className="font-medium">{item.quantity}x</span> Product ID: {item.productId.slice(0,8)}</span>
                            <span className="font-medium shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Shipping Details</h4>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{order.customerName}</p>
                        <p>{order.phone}</p>
                        <p className="text-muted-foreground">{order.address}, {order.city} - {order.postalCode}</p>
                        <p className="mt-2"><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
