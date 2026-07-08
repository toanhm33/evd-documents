import { FileText, Shield, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Select } from '@/shared/components/ui/Select'
import type { UserRole } from '@/app/constants/auth.constants'
import { USER_ROLES } from '@/app/constants/auth.constants'
import { useAuthStore } from '@/app/stores/authStore'

export function AppHeader() {
  const user = useAuthStore((state) => state.user)
  const setRole = useAuthStore((state) => state.setRole)

  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      if (currentY < 10) {
        setVisible(true)
      } else if (currentY > lastScrollY.current) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-20 border-b border-border bg-white shadow-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">
              EVD — Document Management
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-sm sm:flex">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <span>{user.name}</span>
            <span className="text-muted-foreground">({user.role})</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Select
              aria-label="Select demo role"
              value={user.role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-32"
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </header>
  )
}
