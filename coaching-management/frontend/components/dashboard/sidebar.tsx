'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  Home,
  LayoutDashboard,
  PanelLeft,
  Settings,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

export type SidebarProps = { collapsed: boolean; onToggle: () => void; mobileOpen: boolean; onClose: () => void };

type NavItem = { label: string; detail: string; href: string; icon: typeof Home; badge?: string };
type SubmenuItem = { label: string; href: string };

const studentSubmenu: SubmenuItem[] = [
  { label: 'All Students', href: '/dashboard/students' },
  { label: 'Add Student', href: '/dashboard/students/create' },
  { label: 'Student Categories', href: '/dashboard/students/categories' },
  { label: 'Student Reports', href: '/dashboard/students/reports' },
];

const primaryItems: NavItem[] = [
  { label: 'Home', detail: 'Dashboard overview', href: '/dashboard', icon: Home },
  { label: 'Courses', detail: 'Create Course', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Students', detail: 'Create Student Profile', href: '/dashboard/students', icon: GraduationCap },
  { label: 'Enrollments', detail: 'Create an Enrollment', href: '/dashboard/enrollments', icon: LayoutDashboard },
  { label: 'Payments', detail: 'Create a Payment', href: '/dashboard/payments', icon: CircleDollarSign },
  { label: 'Approvals', detail: 'Pending payment approvals', href: '/dashboard/approvals', icon: FileCheck2, badge: '3' },
  { label: 'Report', detail: 'All Reports Here', href: '/dashboard/report', icon: BarChart3 },
];

const secondaryItems: NavItem[] = [
  { label: 'User', detail: 'Global defaults', href: '/dashboard/user', icon: UserRound },
  { label: 'Setting', detail: 'Combine compression en...', href: '/dashboard/settings', icon: Settings },
  { label: 'Britto Academic', detail: '', href: '/dashboard/academic', icon: UsersRound },
];

function NavLink({ item, collapsed, onClose }: { item: NavItem; collapsed: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={`group relative flex min-h-[42px] items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active ? 'bg-[#301d31] text-[#ff648c]' : 'text-[#8b909d] hover:bg-[#1b202a] hover:text-[#dce0e8]'
      } ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <Icon size={19} strokeWidth={1.8} className={active ? 'text-[#54b8ff]' : 'text-current'} />
      {!collapsed && (
        <span className="min-w-0 leading-tight">
          <span className={`block truncate text-[12px] font-medium ${active ? 'text-[#e56b91]' : 'text-[#b8bcc7]'}`}>{item.label}</span>
          {item.detail && <span className="mt-0.5 block truncate text-[9px] text-[#717784]">{item.detail}</span>}
        </span>
      )}
      {!collapsed && item.badge && <span className="ml-auto rounded-full bg-[#3931b5] px-1.5 py-0.5 text-[8px] text-white">{item.badge}</span>}
      {collapsed && item.badge && <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-[#5b52e8]" />}
    </Link>
  );
}

function StudentsNavLink({ collapsed, onClose }: { collapsed: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const nestedStudentRoute = pathname.startsWith('/dashboard/students/');
  const studentRoute = pathname === '/dashboard/students' || nestedStudentRoute;
  const [expanded, setExpanded] = useState(nestedStudentRoute);

  useEffect(() => {
    if (nestedStudentRoute) setExpanded(true);
  }, [nestedStudentRoute]);

  return (
    <div>
      <div className={`group relative flex min-h-[42px] items-center rounded-lg transition-colors ${studentRoute ? 'bg-[#301d31] text-[#ff648c]' : 'text-[#8b909d] hover:bg-[#1b202a] hover:text-[#dce0e8]'}`}>
        <Link href="/dashboard/students" onClick={onClose} title={collapsed ? 'Students' : undefined} className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center px-0' : ''}`}>
          <GraduationCap size={19} strokeWidth={1.8} className={studentRoute ? 'text-[#54b8ff]' : 'text-current'} />
          {!collapsed && <span className="min-w-0 leading-tight"><span className={`block truncate text-[12px] font-medium ${studentRoute ? 'text-[#e56b91]' : 'text-[#b8bcc7]'}`}>Students</span><span className="mt-0.5 block truncate text-[9px] text-[#717784]">Create Student Profile</span></span>}
        </Link>
        {!collapsed && <button type="button" aria-label={`${expanded ? 'Collapse' : 'Expand'} Students submenu`} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="mr-2 rounded p-1 text-[#777e8a] transition-colors hover:bg-[#442541] hover:text-[#e7a2bd]"><ChevronDown size={15} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} /></button>}
      </div>
      <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${expanded && !collapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0 overflow-hidden pl-9 pt-1">
          {studentSubmenu.map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} onClick={onClose} className={`block rounded-md px-3 py-2 text-[10px] transition-colors ${active ? 'bg-[#261d2c] text-[#e66b95]' : 'text-[#777e8a] hover:bg-[#1b202a] hover:text-[#c9cdd5]'}`}>{item.label}</Link>;
          })}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[210px] flex-col border-r border-[#222733] bg-[#11151d] transition-transform duration-300 md:relative md:z-0 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'md:w-[72px]' : ''}`}>
        <div className="flex h-[62px] items-center justify-between border-b border-[#202530] px-5">
          {!collapsed && <div className="flex items-center gap-2.5 text-[11px] font-semibold text-[#e8e9ed]"><GraduationCap size={18} className="text-[#e4a4c8]" /> Britto Academic</div>}
          <button onClick={onToggle} aria-label="Toggle sidebar" className="hidden rounded p-1 text-[#69707c] hover:bg-[#202530] hover:text-white md:block">{collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}</button>
          <button onClick={onClose} aria-label="Close menu" className="text-[#7b818d] md:hidden"><X size={18} /></button>
        </div>
        {!collapsed && <div className="px-5 pb-2 pt-1 text-[9px] text-[#777c88]">v1.0.1</div>}
        <nav className="flex-1 overflow-y-auto px-4 py-1">
          <div className="relative mb-3">
            <PanelLeft size={15} className="absolute left-3 top-2.5 text-[#828795]" />
            {!collapsed && <input aria-label="Search" placeholder="Search" className="h-8 w-full rounded-md border border-[#303746] bg-[#1b222d] pl-9 text-[11px] text-[#d8dce4] outline-none placeholder:text-[#777e8d] focus:border-[#4a8dbd]" />}
          </div>
          <div className="space-y-1">{primaryItems.map((item) => item.label === 'Students' ? <StudentsNavLink key={item.href} collapsed={collapsed} onClose={onClose} /> : <NavLink key={item.href} item={item} collapsed={collapsed} onClose={onClose} />)}</div>
          {!collapsed && <div className="mb-2 mt-5 flex items-center justify-between px-2 text-[9px] uppercase tracking-[0.16em] text-[#767c89]"><span>Britto Box</span><span className="text-[#eb5c7d]">•⌃</span></div>}
          {collapsed && <div className="my-4 border-t border-[#2c313b]" />}
          <div className="space-y-1">{secondaryItems.map((item) => <NavLink key={item.href} item={item} collapsed={collapsed} onClose={onClose} />)}</div>
        </nav>
      </aside>
    </>
  );
}
