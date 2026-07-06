import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Gates a route to specific roles. This is a UX convenience only —
 * the backend's [Authorize] attributes are the real enforcement.
 */
export function RoleRoute({ allow }) {
  const { role, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!allow.includes(role)) return <Navigate to="/not-authorized" replace />

  return <Outlet />
}
