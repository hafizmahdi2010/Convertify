import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CategoryPicker } from '@/components/category-picker'
import { ConverterCard } from '@/components/converter-card'
import { ConverterSkeleton } from '@/components/converter-skeleton'
import {
  HistoryPanel,
  type HistoryEntry,
} from '@/components/history-panel'
import { Badge } from '@/components/ui/badge'
import { getCategory } from '@/lib/units'
import { useLocalStorage } from '@/lib/use-local-storage'

function AppInner() {
  const [activeCategoryId, setActiveCategoryId] = useState('length')
  const [loading, setLoading] = useState(true)
  const [restoreEntry, setRestoreEntry] = useState<HistoryEntry | null>(null)
  const [pending, setPending] = useState<HistoryEntry | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    'convertify-history',
    [],
  )
  const commitTimer = useRef<number | null>(null)

  const activeCategory = getCategory(activeCategoryId) ?? getCategory('length')!

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  const handleConversion = useCallback(
    (conv: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      const entry: HistoryEntry = {
        ...conv,
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      }
      setPending(entry)
    },
    [],
  )

  useEffect(() => {
    if (commitTimer.current) window.clearTimeout(commitTimer.current)
    if (!pending) return
    commitTimer.current = window.setTimeout(() => {
      setHistory((prev) => {
        const last = prev[0]
        const same =
          last &&
          last.category === pending.category &&
          last.fromUnit === pending.fromUnit &&
          last.toUnit === pending.toUnit &&
          Math.abs(last.fromValue - pending.fromValue) < 1e-9
        if (same) return prev
        return [pending, ...prev].slice(0, 12)
      })
    }, 900)
    return () => {
      if (commitTimer.current) window.clearTimeout(commitTimer.current)
    }
  }, [pending, setHistory])

  const handleRestore = (entry: HistoryEntry) => {
    setActiveCategoryId(entry.category)
    setRestoreEntry(entry)
  }

  const handleRemove = useCallback(
    (id: string) => setHistory((prev) => prev.filter((e) => e.id !== id)),
    [setHistory],
  )

  const handleClear = useCallback(() => setHistory([]), [setHistory])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="bg-glow flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 pb-8 pt-14 text-center sm:px-6 sm:pt-20">
          <Badge variant="soft" className="mb-5 gap-1.5 py-1 pl-1.5 pr-3">
            <span className="flex size-4 items-center justify-center rounded-[4px] bg-foreground text-background">
              <Sparkles className="size-2.5" />
            </span>
            Fast · Free · 150+ units
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl">
            Convert anything, instantly.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            A clean, blazing-fast unit converter across 14 categories. No ads,
            no sign-ups — just precise conversions.
          </p>
        </section>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <CategoryPicker
            activeId={activeCategoryId}
            onChange={(id) => {
              setActiveCategoryId(id)
              setRestoreEntry(null)
            }}
          />

          <div className="mt-5">
            {loading ? (
              <ConverterSkeleton />
            ) : (
              <ConverterCard
                key={activeCategory.id}
                category={activeCategory}
                onConversion={handleConversion}
                restoreEntry={
                  restoreEntry?.category === activeCategory.id
                    ? restoreEntry
                    : null
                }
              />
            )}
          </div>

          <div className="mt-6">
            <HistoryPanel
              entries={history}
              onRestore={handleRestore}
              onRemove={handleRemove}
              onClear={handleClear}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
