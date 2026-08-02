import { useEffect, useMemo, useState } from 'react'
import { ArrowUpDown, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UnitSelect } from '@/components/ui/unit-select'
import { CategoryIcon } from '@/components/category-icon'
import { cn } from '@/lib/utils'
import type { Category, Unit } from '@/lib/units'
import { convert } from '@/lib/units'
import { formatNumber, parseNumber } from '@/lib/format'

interface ConverterCardProps {
  category: Category
  onConversion: (entry: {
    category: string
    fromValue: number
    fromUnit: string
    toValue: number
    toUnit: string
  }) => void
  restoreEntry?: {
    category: string
    fromValue: number
    fromUnit: string
    toValue: number
    toUnit: string
    id: string
    timestamp: string
  } | null
}

export function ConverterCard({
  category,
  onConversion,
  restoreEntry,
}: ConverterCardProps) {
  const defaultFrom = category.units[0]
  const defaultTo = category.units[1] ?? category.units[0]

  const [fromUnitId, setFromUnitId] = useState(defaultFrom.id)
  const [toUnitId, setToUnitId] = useState(defaultTo.id)
  const [fromText, setFromText] = useState('1')
  const [toText, setToText] = useState(() =>
    formatNumber(convert(1, defaultFrom, defaultTo)),
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!restoreEntry) return
    setFromUnitId(restoreEntry.fromUnit)
    setToUnitId(restoreEntry.toUnit)
    setFromText(formatNumber(restoreEntry.fromValue))
    setToText(formatNumber(restoreEntry.toValue))
    setCopied(false)
  }, [restoreEntry])

  const fromUnit = useMemo(
    () => category.units.find((u) => u.id === fromUnitId) ?? defaultFrom,
    [category.units, defaultFrom, fromUnitId],
  )
  const toUnit = useMemo(
    () => category.units.find((u) => u.id === toUnitId) ?? defaultTo,
    [category.units, defaultTo, toUnitId],
  )

  const handleFromText = (text: string) => {
    setFromText(text)
    const value = parseNumber(text)
    setToText(value === null ? '' : formatNumber(convert(value, fromUnit, toUnit)))
    if (value !== null) {
      onConversion({
        category: category.id,
        fromValue: value,
        fromUnit: fromUnit.id,
        toValue: convert(value, fromUnit, toUnit),
        toUnit: toUnit.id,
      })
    }
  }

  const handleToText = (text: string) => {
    setToText(text)
    const value = parseNumber(text)
    setFromText(
      value === null ? '' : formatNumber(convert(value, toUnit, fromUnit)),
    )
    if (value !== null) {
      onConversion({
        category: category.id,
        fromValue: convert(value, toUnit, fromUnit),
        fromUnit: fromUnit.id,
        toValue: value,
        toUnit: toUnit.id,
      })
    }
  }

  const handleFromUnit = (id: string) => {
    setFromUnitId(id)
    const next = category.units.find((u) => u.id === id) ?? fromUnit
    const value = parseNumber(fromText)
    if (value !== null) {
      setToText(formatNumber(convert(value, next, toUnit)))
      onConversion({
        category: category.id,
        fromValue: value,
        fromUnit: next.id,
        toValue: convert(value, next, toUnit),
        toUnit: toUnit.id,
      })
    }
  }

  const handleToUnit = (id: string) => {
    setToUnitId(id)
    const next = category.units.find((u) => u.id === id) ?? toUnit
    const value = parseNumber(toText)
    if (value !== null) {
      setFromText(formatNumber(convert(value, next, fromUnit)))
      onConversion({
        category: category.id,
        fromValue: convert(value, next, fromUnit),
        fromUnit: fromUnit.id,
        toValue: value,
        toUnit: next.id,
      })
    }
  }

  const swap = () => {
    setFromUnitId(toUnit.id)
    setToUnitId(fromUnit.id)
    setFromText(toText)
    setToText(fromText)
  }

  const handleCopy = async () => {
    const text = `${fromText} ${fromUnit.symbol} = ${toText} ${toUnit.symbol}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const fromValue = parseNumber(fromText)

  return (
    <Card className="overflow-visible">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-accent/50">
              <CategoryIcon name={category.icon} className="size-4" />
            </span>
            <h2 className="text-sm font-semibold tracking-tight">
              {category.name}
            </h2>
            <p className="hidden text-xs text-muted-foreground sm:inline">
              {category.description}
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-wider">
            Precise
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
          <ConverterField
            label="From"
            inputId="from-value"
            text={fromText}
            onText={handleFromText}
            unit={fromUnit}
            units={category.units}
            onUnit={handleFromUnit}
          />

          <div className="flex justify-center sm:py-1">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label="Swap units"
              title="Swap units"
              className="group size-9 rounded-full bg-background shadow-sm"
            >
              <ArrowUpDown className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Button>
          </div>

          <ConverterField
            label="To"
            inputId="to-value"
            text={toText}
            onText={handleToText}
            unit={toUnit}
            units={category.units}
            onUnit={handleToUnit}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            {fromValue !== null ? (
              <>
                <span className="font-medium tabular-nums text-foreground">
                  {fromText}
                </span>{' '}
                {fromUnit.symbol} equals{' '}
                <span className="font-medium tabular-nums text-foreground">
                  {toText}
                </span>{' '}
                {toUnit.symbol}
              </>
            ) : (
              <span>Enter a value to convert</span>
            )}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className={cn('shrink-0 transition-colors', copied && 'border-transparent')}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy result'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ConverterFieldProps {
  label: string
  inputId: string
  text: string
  onText: (value: string) => void
  unit: Unit
  units: Unit[]
  onUnit: (id: string) => void
}

function ConverterField({
  label,
  inputId,
  text,
  onText,
  unit,
  units,
  onUnit,
}: ConverterFieldProps) {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <Input
            id={inputId}
            value={text}
            onChange={(e) => onText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            aria-label={`${label} value`}
            className="h-11 pr-12 text-right font-mono text-lg tabular-nums"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit.symbol}
          </span>
        </div>
        <div className="sm:w-44">
          <UnitSelect
            id={`${inputId}-unit`}
            units={units}
            value={unit.id}
            onChange={onUnit}
          />
        </div>
      </div>
    </div>
  )
}
