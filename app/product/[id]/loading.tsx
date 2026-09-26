import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div role="status" aria-label="Loading product" aria-busy="true" className="pb-24">
      <span className="sr-only">Loading product details</span>
      <Skeleton className="mb-4 h-10 w-36 rounded-full" />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-[25px] bg-[rgba(26,24,20,0.92)] p-5 md:p-8 lg:p-6 xl:p-8">
          <div className="grid gap-4 lg:grid-cols-[68px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-16 w-16 shrink-0 rounded-2xl bg-white/10" />
              ))}
            </div>
            <Skeleton className="order-1 min-h-[20rem] rounded-2xl bg-white/10 lg:order-2 lg:min-h-[30rem]" />
          </div>
        </div>

        <div className="space-y-6 rounded-[25px] bg-[rgba(26,24,20,0.92)] p-6">
          <Skeleton className="h-5 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10" />
          <Skeleton className="h-4 w-1/3 bg-white/10" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-9 w-11 rounded-full bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="mb-5 h-7 w-52" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="aspect-square rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
