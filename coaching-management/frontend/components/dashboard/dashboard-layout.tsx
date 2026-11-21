'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eadef8] p-2 md:p-[3.8vw] lg:p-[3.9vw]">
      <div className="mx-auto flex min-h-[calc(100vh-16px)] max-w-[1440px] overflow-hidden border border-[#282d36] bg-[#0e1219] shadow-2xl shadow-[#bba7d2]/30 md:min-h-[calc(100vh-7.6vw)]">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="min-w-0 flex-1 bg-[#0e1219]">
          <div className="flex items-center border-b border-[#1b2029] bg-[#0e1219] px-4 py-3 md:hidden"><button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-[#aeb4bf]"><Menu size={20} /></button><span className="ml-3 text-sm font-semibold text-white">Britto Academic</span></div>
          <Navbar />
          <div className="min-h-[calc(100vh-108px)] bg-[linear-gradient(rgba(28,34,44,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(28,34,44,.28)_1px,transparent_1px)] bg-[size:54px_54px] px-4 py-6 md:px-8 md:py-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
