"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/services/orderService";
import { DataTable } from "@/components/shared/DataTable";
import { User } from "lucide-react";

export default function AdminUsersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll().catch(() => []),
  });

  const users = Array.from(new Map(
    orders.map(o => [
      o.phone, 
      { 
        name: o.customerName, 
        phone: o.phone, 
        email: o.email || 'N/A', 
        address: `${o.city}, ${o.postalCode}`,
        lastOrder: o.createdAt
      }
    ])
  ).values());

  const columns = [
    { key: "icon", label: "", render: () => <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-4 h-4 text-primary" /></div> },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Location" },
    { key: "lastOrder", label: "Last Order", render: (val: any) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
