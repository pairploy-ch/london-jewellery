export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-4xl px-5 py-12 md:px-10 md:py-16">
        <div className="h-3 w-32 animate-pulse rounded bg-line" />

        <div className="mt-6 animate-pulse space-y-3">
          <div className="h-10 w-72 rounded bg-line" />
          <div className="h-5 w-40 rounded bg-line" />
          <div className="h-3 w-28 rounded bg-line" />
        </div>

        <div className="mt-10 animate-pulse divide-y divide-line">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-6 py-4">
              <div className="h-4 w-44 shrink-0 rounded bg-line" />
              <div className="h-4 w-56 rounded bg-line" />
            </div>
          ))}
        </div>

        <div className="mt-12 h-7 w-48 animate-pulse rounded bg-line" />
        <div className="mt-6 grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-line" />
          ))}
        </div>
      </section>
    </main>
  );
}
