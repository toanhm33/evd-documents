export const USER_ROLES = ['ADMIN', 'STAFF'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const DEMO_USERS = {
  admin: { id: 'admin1', name: 'Admin User', role: 'ADMIN' as const },
  staff: { id: 'staff1', name: 'Staff User', role: 'STAFF' as const },
} as const
