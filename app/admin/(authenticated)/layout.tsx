import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { ToastProvider } from '@/components/admin/toast';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#f5edc7]">
        <AdminSidebar />
        <div className="flex-1">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
