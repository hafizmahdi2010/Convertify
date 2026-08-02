import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Unit } from '@/lib/units'

interface UnitSelectProps {
  units: Unit[]
  value: string
  onChange: (id: string) => void
  id: string
  align?: 'start' | 'end'
}

export function UnitSelect({
  units,
  value,
  onChange,
  id,
  align = 'start',
}: UnitSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = units.find((u) => u.id === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return units
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.symbol.toLowerCase().includes(q),
    )
  }, [units, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(Math.max(0, filtered.findIndex((u) => u.id === value)))
    const t = setTimeout(() => searchRef.current?.focus(), 10)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    )
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const select = (unitId: string) => {
    onChange(unitId)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const active = filtered[activeIndex]
      if (active) select(active.id)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate">{selected?.name ?? 'Select unit'}</span>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {selected?.symbol}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-label="Unit"
          className={cn(
            'absolute z-50 mt-1.5 w-full min-w-[16rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl animate-in',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault()
                }
              }}
              placeholder="Search units…"
              className="h-9 w-full bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto overscroll-contain p-1"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No units found
              </div>
            ) : (
              filtered.map((u, index) => (
                <button
                  key={u.id}
                  type="button"
                  role="option"
                  aria-selected={u.id === value}
                  data-index={index}
                  onClick={() => select(u.id)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                    index === activeIndex && 'bg-accent text-accent-foreground',
                  )}
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate">{u.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {u.symbol}
                    </span>
                  </span>
                  {u.id === value && (
                    <Check className="size-3.5 shrink-0 text-foreground" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
