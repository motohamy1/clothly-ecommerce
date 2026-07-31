'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Variant = 'sidebar' | 'page';

interface SignOutButtonProps {
  variant?: Variant;
}

export default function SignOutButton({ variant = 'sidebar' }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    const dest = variant === 'sidebar' ? '/admin/login' : '/';
    router.push(dest);
    router.refresh();
  };

  if (variant === 'sidebar') {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={handleSignOut}
        className="w-full justify-start gap-3 text-[#1A1814]/55 hover:text-[#1A1814] hover:bg-[rgba(26,24,20,0.06)] px-3 py-2.5 h-auto rounded-md text-[15px] font-normal"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSignOut}
      className="justify-start gap-3 text-[#1A1814] hover:bg-[rgba(26,24,20,0.04)] px-3 py-2.5 h-auto rounded-md text-[15px] font-normal"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
