import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'

export interface DropdownItem {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

interface DropdownButtonProps {
  label: string
  icon?: React.ReactNode
  items: DropdownItem[]
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  disabled?: boolean
  className?: string
}

export function DropdownButton({
  label,
  icon,
  items,
  variant = 'outline',
  disabled = false,
  className,
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        variant={variant}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="whitespace-nowrap"
      >
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        {label}
        <ChevronDown className={cn('ml-2 h-4 w-4 transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-md border border-border bg-white shadow-md">
          {items.map((item) => (
            <button
              key={item.key}
              disabled={item.disabled}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {item.icon && <span className="flex items-center text-muted-foreground">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
