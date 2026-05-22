"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  Tag
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Banners", href: "/admin/banners", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Settings },
];

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/admin/login");
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col border-r border-slate-800/80",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="min-h-20 flex items-center gap-3 px-6 py-5 border-b border-slate-800 shrink-0">
        <div className="size-9 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black">GH</div>
        <div>
          <h1 className="text-base font-black text-white tracking-tight">GadgetHub Admin</h1>
          <p className="text-xs text-slate-400">Control Panel</p>
        </div>
        <button className="ml-auto md:hidden" onClick={() => setIsOpen(false)}>
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-md transition-colors text-sm font-semibold",
                isActive 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-300 rounded-md hover:bg-slate-900 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
