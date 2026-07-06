import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Store } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { FormField, Input } from '../../components/FormField'
import { Button } from '../../components/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const { user } = await login(values)
      toast.success('Welcome back!')
      const fallback = user?.role === 2 ? '/pos' : '/dashboard'
      const redirectTo = location.state?.from?.pathname || fallback
      navigate(redirectTo, { replace: true })
    } catch {
      // Error toast already shown by the axios interceptor.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded bg-ink text-register-400">
            <Store size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Storekeeper</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-card">
          <FormField label="Email" error={errors.email?.message} required>
            <Input type="email" placeholder="you@store.com" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message} required>
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
