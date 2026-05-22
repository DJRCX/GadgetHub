"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/services/orderService";
import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll().catch(() => []),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string, status: any }) => orderService.updateStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedOrder(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orderService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    if (confirm(`Change status to ${status}?`)) {
      updateStatusMutation.mutate({ id, status: status as any });
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("Delete this order permanently? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { key: "id", label: "Order ID", render: (val: any) => <span className="font-mono text-xs">{val.slice(0, 8)}</span> },
    { key: "customerName", label: "Customer" },
    { key: "phone", label: "Phone" },
    { key: "total", label: "Total", render: (val: any) => formatCurrency(val) },
    { 
      key: "status", 
      label: "Status",
      render: (val: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          val === 'Pending' ? 'bg-amber-100 text-amber-800' :
          val === 'Processing' ? 'bg-blue-100 text-blue-800' :
          val === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
          val === 'Delivered' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {val}
        </span>
      )
    },
    { key: "createdAt", label: "Date", render: (val: any) => new Date(val).toLocaleDateString() },
    { 
      key: "actions", 
      label: "Actions", 
      render: (_: any, row: any) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(row)}>
            View Details
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={() => handleDeleteOrder(row.id)}
            disabled={deleteMutation.isPending}
            aria-label={`Delete order ${row.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ) 
    },
  ];

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <DataTable
          columns={columns}
          data={sortedOrders}
          isLoading={isLoading}
        />
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id.slice(0, 8).toUpperCase()}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase mb-2">Customer Info</h3>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Payment:</span> {selectedOrder.paymentMethod}
                  </p>
                  {selectedOrder.transactionId && (
                    <p className="text-sm">
                      <span className="font-semibold">Txn ID:</span> {selectedOrder.transactionId}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase mb-2">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.address}</p>
                  <p className="text-sm">{selectedOrder.city}</p>
                  <p className="text-sm">Postal: {selectedOrder.postalCode}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase mb-2">Order Items</h3>
                <div className="border border-border rounded-md divide-y divide-border">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold bg-muted px-2 py-1 rounded text-xs">{item.quantity}x</span>
                        <span className="text-sm font-medium">Product ID: {item.productId.slice(0, 8)}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="p-3 flex justify-between items-center bg-muted/30">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-accent text-lg">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <Button 
                      key={status}
                      size="sm"
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status || updateStatusMutation.isPending}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
