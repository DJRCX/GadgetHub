import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GadgetHub - Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
