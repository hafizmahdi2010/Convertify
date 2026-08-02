import type { Unit } from './units'
import { convert } from './units'

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-7)) {
    return value.toExponential(8).replace(/(\.\d*?)0+e/, '$1e')
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 10 })
}

export function parseNumber(input: string): number | null {
  const normalized = input.replace(/,/g, '').trim()
  if (normalized === '' || normalized === '-' || normalized === '.') return null
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

export function formatEquation(value: number, from: Unit, to: Unit): string {
  return `${formatNumber(value)} ${from.symbol} = ${formatNumber(
    convert(value, from, to),
  )} ${to.symbol}`
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const seconds = Math.round(diff / 1000)
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
