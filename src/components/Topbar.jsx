import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '../utils/constants'

export function Topbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm text-slate-500">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-ink">{user?.name || 'User'}</div>
          <div className="text-xs text-slate-400">{ROLE_LABELS[role] ?? '—'}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-brick-500"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </header>
  )
}
