import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="grid gap-5">
      <div>
        <div className="h-8 w-40 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-surface-2" />
      </div>
      <LoadingSkeleton />
    </div>
  );
}
