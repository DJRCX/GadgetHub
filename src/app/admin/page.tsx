"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/lib/services/productService";
import { orderService } from "@/lib/services/orderService";
import { MetricCard } from "@/components/shared/MetricCard";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { DataTable } from "@/components/shared/DataTable";

export default function AdminDashboard() {
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll().catch(() => []),
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const orderColumns = [
    { key: "id", label: "Order ID", render: (val: any) => val.slice(0, 8).toUpperCase() },
    { key: "customerName", label: "Customer" },
    { key: "total", label: "Total", render: (val: any) => formatCurrency(val) },
    { 
      key: "status", 
      label: "Status",
      render: (val: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          val === 'Pending' ? 'bg-amber-100 text-amber-800' :
          val === 'Delivered' ? 'bg-green-100 text-green-800' :
          val === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {val}
        </span>
      )
    },
    { key: "createdAt", label: "Date", render: (val: any) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          trend="+12%"
          trendLabel="vs last month"
          isLoading={isLoadingOrders}
        />
        <MetricCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
          trend="+5%"
          trendLabel="vs last month"
          isLoading={isLoadingOrders}
        />
        <MetricCard
          title="Total Products"
          value={products.length}
          icon={<Package className="w-5 h-5 text-indigo-600" />}
          isLoading={isLoadingProducts}
        />
        <MetricCard
          title="Pending Actions"
          value={pendingOrders + outOfStock}
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          trend={`${pendingOrders} orders, ${outOfStock} items out of stock`}
          trendLabel="Requires attention"
          isLoading={isLoadingOrders || isLoadingProducts}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <DataTable
          columns={orderColumns}
          data={recentOrders}
          isLoading={isLoadingOrders}
          emptyMessage="No recent orders."
        />
      </div>
    </div>
  );
}
