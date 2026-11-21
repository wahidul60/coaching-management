import { LayoutDashboard } from 'lucide-react';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <div className="mx-auto flex min-h-[55vh] max-w-[1160px] items-center justify-center"><div className="text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#3a3040] bg-[#241b2e] text-[#ec5c88]"><LayoutDashboard size={21} /></div><h2 className="text-lg font-semibold text-[#e1e4e9]">{title}</h2><p className="mt-2 text-sm text-[#858b96]">{description}</p></div></div>;
}
