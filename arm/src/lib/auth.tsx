import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  admin: AdminUser | null
  setAdmin: (admin: AdminUser | null) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'onest_admin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdminState] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const setAdmin = (user: AdminUser | null) => {
    setAdminState(user)
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const logout = () => {
    setAdmin(null)
  }

  useEffect(() => {
    // Sync across tabs
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAdminState(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, setAdmin, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
