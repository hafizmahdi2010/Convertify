import { CategoryIcon } from '@/components/category-icon'
import { cn } from '@/lib/utils'
import { categories } from '@/lib/units'

interface CategoryPickerProps {
  activeId: string
  onChange: (id: string) => void
}

export function CategoryPicker({ activeId, onChange }: CategoryPickerProps) {
  return (
    <div
      role="tablist"
      aria-label="Unit categories"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const active = category.id === activeId
        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(category.id)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]',
              active
                ? 'border-transparent bg-foreground text-background shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <CategoryIcon name={category.icon} className="size-3.5" />
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
