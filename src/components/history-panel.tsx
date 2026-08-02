import { History, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryIcon } from '@/components/category-icon'
import { formatRelativeTime } from '@/lib/format'
import { getCategory } from '@/lib/units'

export interface HistoryEntry {
  id: string
  category: string
  fromValue: number
  fromUnit: string
  toValue: number
  toUnit: string
  timestamp: string
}

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onRestore: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export function HistoryPanel({
  entries,
  onRestore,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 p-5 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="size-4 text-muted-foreground" />
          Recent conversions
        </CardTitle>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
            Clear all
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <History className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No conversions yet
            </p>
            <p className="max-w-[18rem] text-xs text-muted-foreground/70">
              Your recent conversions will appear here automatically.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {entries.map((entry) => {
              const category = getCategory(entry.category)
              const from = category?.units.find((u) => u.id === entry.fromUnit)
              const to = category?.units.find((u) => u.id === entry.toUnit)
              if (!from || !to) return null
              return (
                <li key={entry.id}>
                  <div className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2.5 text-left transition-colors hover:border-border hover:bg-accent/40">
                    <button
                      type="button"
                      onClick={() => onRestore(entry)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                        <CategoryIcon
                          name={category?.icon ?? 'Ruler'}
                          className="size-3.5 text-muted-foreground"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          <span className="font-medium tabular-nums">
                            {entry.fromValue.toLocaleString('en-US', {
                              maximumFractionDigits: 6,
                            })}
                          </span>{' '}
                          {from.symbol}
                          <span className="mx-1.5 text-muted-foreground">
                            →
                          </span>
                          <span className="font-medium tabular-nums">
                            {entry.toValue.toLocaleString('en-US', {
                              maximumFractionDigits: 6,
                            })}
                          </span>{' '}
                          {to.symbol}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {category?.name} · {formatRelativeTime(entry.timestamp)}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(entry.id)}
                      aria-label="Remove conversion"
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
