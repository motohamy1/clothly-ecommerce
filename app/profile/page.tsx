import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ProfileClient from './profile-client';
import SignOutButton from '@/components/admin/sign-out-button';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?next=/profile');
  }

  return (
    <main className="min-h-screen bg-[#f5edc7] pt-32 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="h-[2px] w-12 bg-[#B8763A] mb-6" />
          <h1 className="text-[32px] font-semibold leading-[1.2] mb-2 text-[#1A1814]">
            Your account
          </h1>
          <p className="text-[15px] text-[rgba(26,24,20,0.6)]">
            Signed in as <span className="text-[#1A1814] font-medium">{session.email}</span>
            {session.role === 'admin' && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium bg-[#B8763A] text-[#FAF7F2]">
                Admin
              </span>
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[rgba(26,24,20,0.08)] bg-[#FFFEFC] p-6 mb-6">
          <h2 className="text-[18px] font-semibold text-[#1A1814] mb-1">Profile details</h2>
          <p className="text-[13px] text-[rgba(26,24,20,0.6)] mb-6">
            Saved shipping and order history will appear here in a future update.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div>
              <dt className="text-[12px] uppercase tracking-[0.15em] text-[rgba(26,24,20,0.6)] mb-1">Email</dt>
              <dd className="text-[#1A1814]">{session.email}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-[0.15em] text-[rgba(26,24,20,0.6)] mb-1">Role</dt>
              <dd className="text-[#1A1814] capitalize">{session.role}</dd>
            </div>
          </dl>
        </div>

        {session.role === 'admin' && (
          <div className="rounded-xl border border-[rgba(26,24,20,0.08)] bg-[#FFFEFC] p-6 mb-6">
            <h2 className="text-[18px] font-semibold text-[#1A1814] mb-1">Admin tools</h2>
            <p className="text-[13px] text-[rgba(26,24,20,0.6)] mb-4">
              Manage products, view catalog stats, and edit the live storefront.
            </p>
            <a
              href="/admin"
              className="inline-flex items-center h-10 px-4 rounded-lg bg-[#1A1814] text-[#FAF7F2] font-medium hover:bg-[#1A1814]/90 transition-colors duration-200"
            >
              Open admin panel
            </a>
          </div>
        )}

        <div className="flex justify-start">
          <SignOutButton variant="page" />
        </div>
      </div>

      <ProfileClient />
    </main>
  );
}
