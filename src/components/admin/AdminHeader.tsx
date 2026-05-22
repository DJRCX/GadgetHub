"use client";

import { Menu, Search, Bell } from "lucide-react";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white/95 border-b border-slate-200 flex items-center px-4 sm:px-6 sticky top-0 z-30 shadow-sm shrink-0 backdrop-blur">
      <button 
        onClick={onMenuClick}
        className="mr-4 p-2 rounded-md hover:bg-slate-100 text-slate-600 md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 flex items-center justify-between">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search orders, products..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-md text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
