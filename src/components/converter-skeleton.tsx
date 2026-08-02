import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ConverterSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-4">
          <div>
            <Skeleton className="mb-2 h-3 w-10" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <Skeleton className="h-11 flex-1 rounded-md" />
              <Skeleton className="h-11 sm:w-44 rounded-md" />
            </div>
          </div>
          <div className="mx-auto sm:mb-0.5">
            <Skeleton className="size-9 rounded-full" />
          </div>
          <div>
            <Skeleton className="mb-2 h-3 w-10" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <Skeleton className="h-11 flex-1 rounded-md" />
              <Skeleton className="h-11 sm:w-44 rounded-md" />
            </div>
          </div>
        </div>

        <Skeleton className="mt-6 h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
