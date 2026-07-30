'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSignOut}
      className="w-full justify-start gap-3 text-[rgba(250,247,242,0.6)] hover:text-[#FAF7F2] hover:bg-[rgba(250,247,242,0.05)] px-3 py-2.5 h-auto rounded-md text-[15px] font-normal"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
