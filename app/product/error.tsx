'use client';

export default function ProductError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="max-w-[480px] text-center">
        <h1 className="text-[24px] font-semibold text-[#1A1814]">This product couldn&apos;t load.</h1>
        <p className="mt-3 text-[15px] text-[rgba(26,24,20,0.6)]">
          Try again in a minute.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-10 px-4 rounded-lg bg-[#1A1814] text-[#FAF7F2] text-[14px] font-medium"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
