import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { Store } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { NAV_ITEMS } from '../utils/navItems'

export function Sidebar() {
  const { role } = useAuth()
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-ink text-paper">
      <div className="flex items-center gap-2 px-5 py-5">
        <Store size={20} className="text-register-400" />
        <span className="font-display text-base font-semibold">Storekeeper</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-register-500 text-white'
                  : 'text-slate-200/80 hover:bg-white/5 hover:text-paper',
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-slate-400">v0.1.0</div>
    </aside>
  )
}
