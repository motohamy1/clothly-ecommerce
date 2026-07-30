import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/admin-sidebar';
import SignOutButton from '@/components/admin/sign-out-button';
import { ToastProvider } from '@/components/admin/toast';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#FAF7F2]">
        <AdminSidebar />
        <div className="flex-1">
          <header className="flex justify-end items-center gap-4 border-b border-[rgba(26,24,20,0.08)] px-8 h-16">
            <span className="text-[13px] text-[rgba(26,24,20,0.6)]">{session.email}</span>
            <SignOutButton />
          </header>
          <main className="p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
