import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, ROLE_NAME_TO_VALUE } from '../utils/constants'

export const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Backends vary on how they serialize enums: some send the integer (0),
// some send the numeric value as a string ("0"), and some (common with
// ASP.NET Core's JsonStringEnumConverter) send the name ("Admin"). Normalize
// whatever comes back into the numeric enum the rest of the app expects, so
// role checks don't silently fail depending on backend serialization choices.
function normalizeUser(user) {
  if (!user) return user
  const { role } = user
  if (typeof role === 'number') return user
  if (typeof role === 'string' && role.trim() !== '' && !Number.isNaN(Number(role))) {
    return { ...user, role: Number(role) }
  }
  if (typeof role === 'string' && role in ROLE_NAME_TO_VALUE) {
    return { ...user, role: ROLE_NAME_TO_VALUE[role] }
  }
  return user
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()))
  const [isLoading, setIsLoading] = useState(false)

  // Keep localStorage in sync whenever token/user change.
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(TOKEN_STORAGE_KEY)
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_STORAGE_KEY)
  }, [user])

  const login = useCallback(async (credentials) => {
    setIsLoading(true)
    try {
      const data = await authApi.login(credentials)
      // Actual backend shape is flat:
      // { userId, fullName, email, role, token, expiresAt }
      const normalizedUser = normalizeUser({
        id: data.userId,
        name: data.fullName,
        email: data.email,
        role: data.role,
      })
      setToken(data.token)
      setUser(normalizedUser)
      return { ...data, user: normalizedUser }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
