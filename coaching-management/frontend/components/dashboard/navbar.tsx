import { Home, MoreHorizontal } from 'lucide-react';

export function Navbar() {
  return (
    <header className="flex h-[92px] items-center border-b border-[#1b2029] bg-[#0e1219] px-6 md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#442340] bg-[#241829] text-[#eb4e85]"><Home size={17} /></div>
        <div><h1 className="text-[17px] font-semibold text-[#e3e5e9]">Home</h1><p className="text-[10px] text-[#777d89]">Welcome to OmniRoute</p></div>
      </div>
      <button aria-label="More options" className="ml-auto text-[#6f7581] hover:text-white"><MoreHorizontal size={18} /></button>
    </header>
  );
}
