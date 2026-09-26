import { Skeleton } from '@/components/ui/skeleton';

const productPlaceholders = [0, 1, 2, 3, 4, 5];

export default function Loading() {
  return (
    <div role="status" aria-label="Loading page" aria-busy="true" className="min-h-[60vh] pb-16">
      <span className="sr-only">Loading page content</span>

      <header className="mb-12 max-w-3xl">
        <Skeleton className="mb-5 h-5 w-32 rounded-full" />
        <Skeleton className="h-12 w-4/5 max-w-xl md:h-16" />
      </header>

      {[0, 1, 2].map((section) => (
        <section key={section} className="mb-12">
          <Skeleton className="mb-5 h-7 w-36" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {productPlaceholders.slice(0, section === 0 ? 4 : 3).map((item) => (
              <div key={item} className="min-w-0">
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="mt-3 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
