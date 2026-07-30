import { getAdminStats } from '@/lib/admin';
import { Card } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <>
      <h1 className="text-[24px] font-semibold leading-[1.3] text-[#1A1814]">Dashboard</h1>
      <p className="mt-1 text-[15px] text-[rgba(26,24,20,0.6)]">Real-time view of what&apos;s in the catalog.</p>

      <div className="flex items-center gap-3 mt-6">
        <span
          className={`w-1 h-4 ${stats.connected ? 'bg-[#3F6B47]' : 'bg-[#8B2E1F]'} mr-3 rounded-sm`}
        />
        <span className="text-[15px] text-[#1A1814]">
          {stats.connected
            ? 'Connected to the catalog server.'
            : `Can't reach the catalog server.${stats.error ? ` ${stats.error}` : ''}`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="p-6 border border-[rgba(26,24,20,0.08)] shadow-none">
          <div className="text-[32px] font-semibold leading-[1.1] text-[#B8763A] tabular-nums">
            {stats.totalProducts}
          </div>
          <div className="mt-2 text-[13px] text-[rgba(26,24,20,0.6)]">Products</div>
        </Card>
        <Card className="p-6 border border-[rgba(26,24,20,0.08)] shadow-none">
          <div className="text-[32px] font-semibold leading-[1.1] text-[#1A1814] tabular-nums">
            {stats.bySection.men}
          </div>
          <div className="mt-2 text-[13px] text-[rgba(26,24,20,0.6)]">Men</div>
        </Card>
        <Card className="p-6 border border-[rgba(26,24,20,0.08)] shadow-none">
          <div className="text-[32px] font-semibold leading-[1.1] text-[#1A1814] tabular-nums">
            {stats.bySection.women}
          </div>
          <div className="mt-2 text-[13px] text-[rgba(26,24,20,0.6)]">Women</div>
        </Card>
        <Card className="p-6 border border-[rgba(26,24,20,0.08)] shadow-none">
          <div className="text-[32px] font-semibold leading-[1.1] text-[#1A1814] tabular-nums">
            {stats.bySection.kids}
          </div>
          <div className="mt-2 text-[13px] text-[rgba(26,24,20,0.6)]">Kids</div>
        </Card>
      </div>

      <Card className="mt-6 p-6 border border-[rgba(26,24,20,0.08)] shadow-none">
        <h2 className="text-[18px] font-semibold text-[#1A1814]">Recent activity</h2>
        <p className="mt-2 text-[15px] text-[rgba(26,24,20,0.6)]">
          No edits yet. Add your first product to see activity here.
        </p>
      </Card>
    </>
  );
}
