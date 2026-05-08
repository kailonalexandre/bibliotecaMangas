export function LoadingSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="grid grid-cols-[92px_1fr] gap-3 rounded-xl border border-line bg-surface p-3">
          <div className="aspect-[2/3] animate-pulse rounded-lg bg-surface-2" />
          <div className="grid content-start gap-3">
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
            <div className="mt-6 h-2 animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
