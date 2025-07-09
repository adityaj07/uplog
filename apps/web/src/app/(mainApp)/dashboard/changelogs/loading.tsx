import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Page Heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-1/4 rounded-lg" />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border shadow-sm space-y-3">
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4 rounded" />

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
