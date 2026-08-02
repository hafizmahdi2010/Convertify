import {
  Activity,
  Clock,
  Compass,
  FlaskConical,
  Fuel,
  Gauge,
  HardDrive,
  Ruler,
  Square,
  Thermometer,
  Weight,
  Wifi,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Ruler,
  Weight,
  Thermometer,
  Square,
  FlaskConical,
  Clock,
  Gauge,
  HardDrive,
  Zap,
  Wind,
  Compass,
  Activity,
  Wifi,
  Fuel,
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = iconMap[name] ?? Ruler
  return <Icon className={className} aria-hidden="true" />
}
