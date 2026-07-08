import { create } from 'zustand'
import { DEMO_USERS } from '@/app/constants/auth.constants'
import type { UserRole } from '@/app/constants/auth.constants'

interface AuthUser {
  id: string
  name: string
  role: UserRole
}

interface AuthState {
  user: AuthUser
  setRole: (role: UserRole) => void
  isAdmin: () => boolean
  isStaff: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEMO_USERS.admin,
  setRole: (role) => {
    set({ user: role === 'ADMIN' ? DEMO_USERS.admin : DEMO_USERS.staff })
  },
  isAdmin: () => get().user.role === 'ADMIN',
  isStaff: () => get().user.role === 'STAFF',
}))
