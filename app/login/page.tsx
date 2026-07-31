import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './login-form';

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  await searchParams;

  if (await getSession()) {
    redirect('/');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5edc7] px-4 pt-32 pb-16">
      <LoginForm />
    </main>
  );
}
