'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import SignOutButton from '@/components/admin/sign-out-button';

const navItems = [
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-[220px] shrink-0 sticky top-4 flex flex-col py-4 px-3" style={{ background: '#efe5bb', borderRadius: '20px', height: '50vh' }}>
      <div className="px-3 mb-4 text-[13px] font-medium uppercase tracking-[0.2em]" style={{ color: 'rgba(26, 24, 20, 0.45)' }}>Admin</div>
      <ul className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link href={href} className={cn('relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] transition-colors duration-200', isActive ? 'text-[#1A1814]' : 'text-[#1A1814]/55 hover:text-[#1A1814]/70')} style={isActive ? { background: 'rgba(176, 130, 50, 0.15)' } : undefined} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(26, 24, 20, 0.06)'; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ''; }}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#B8763A] rounded-full" />}
                <Icon className="h-4 w-4" />{label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto"><SignOutButton /></div>
    </nav>
  );
}
