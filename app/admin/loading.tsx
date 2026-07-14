export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <div className="flex items-center justify-between gap-4">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-24 rounded bg-line" />
            <div className="h-10 w-56 rounded bg-line" />
          </div>
          <div className="h-11 w-28 animate-pulse rounded bg-line" />
        </div>

        <div className="mt-4 h-4 w-40 animate-pulse rounded bg-line" />

        <div className="mt-8 animate-pulse divide-y divide-line border border-line">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-5">
              <div className="h-4 w-20 rounded bg-line" />
              <div className="h-4 w-32 rounded bg-line" />
              <div className="h-4 w-24 rounded bg-line" />
              <div className="h-4 w-16 rounded bg-line" />
              <div className="ml-auto h-4 w-16 rounded bg-line" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
