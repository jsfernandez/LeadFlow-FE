import { cn } from "@/lib/utils";

/**
 * Skeleton loading component
 * Used to show placeholder UI while content is loading
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800/50", className)}
      {...props}
    />
  );
}

/**
 * Table skeleton for loading states
 */
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

/**
 * Card skeleton for loading states
 */
function CardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Stats card skeleton for dashboard metrics
 */
function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export { Skeleton, TableSkeleton, CardSkeleton, StatsCardSkeleton };
