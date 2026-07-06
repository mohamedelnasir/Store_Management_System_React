import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-4 text-center">
      <p className="figure text-5xl font-semibold text-slate-300">404</p>
      <h1 className="font-display text-xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as={Link} to="/dashboard" className="mt-2">
        Back to dashboard
      </Button>
    </div>
  )
}
