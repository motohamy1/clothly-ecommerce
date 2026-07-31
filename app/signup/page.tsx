import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SignupForm from './signup-form';

export default async function SignupPage() {
  if (await getSession()) {
    redirect('/');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5edc7] px-4 pt-32 pb-16">
      <SignupForm />
    </main>
  );
}
