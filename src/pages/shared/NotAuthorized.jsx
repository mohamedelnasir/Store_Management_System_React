import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '../../components/Button'

export default function NotAuthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-4 text-center">
      <ShieldAlert size={32} className="text-brick-500" />
      <h1 className="font-display text-xl font-semibold text-ink">Not authorized</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Your role doesn't have access to this page. If you think this is a mistake, contact an
        administrator.
      </p>
      <Button as={Link} to="/dashboard" className="mt-2">
        Back to dashboard
      </Button>
    </div>
  )
}
