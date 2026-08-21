import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function LoadingLavagna() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Skeleton className="mt-5 h-9 w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
