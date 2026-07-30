'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Package } from 'lucide-react';
import SignOutButton from '@/components/admin/sign-out-button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-[220px] shrink-0 h-screen sticky top-0 bg-[#1A1814] text-[#FAF7F2] flex flex-col py-6 px-3">
      <div className="px-3 mb-6 text-[13px] font-medium uppercase tracking-[0.2em] text-[rgba(250,247,242,0.6)]">
        Admin
      </div>

      <ul className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] transition-colors duration-200 hover:bg-[rgba(250,247,242,0.05)]',
                  isActive ? 'text-[#FAF7F2]' : 'text-[rgba(250,247,242,0.6)]',
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#B8763A]" />
                )}
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto">
        <SignOutButton />
      </div>
    </nav>
  );
}
