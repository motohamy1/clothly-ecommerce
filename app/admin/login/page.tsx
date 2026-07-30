import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/login-form';

interface PageProps {
  searchParams: Promise<{ denied?: string; expired?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if ((await getSession())?.role === 'admin') {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <LoginForm denied={params.denied === '1'} expired={params.expired === '1'} />
    </main>
  );
}
