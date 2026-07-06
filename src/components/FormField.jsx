import { forwardRef } from 'react'
import clsx from 'clsx'

export function FormField({ label, error, hint, children, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">
        {label}
        {required && <span className="text-brick-500"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-brick-500">{error}</span>}
    </label>
  )
}

// These must use forwardRef: react-hook-form's register() attaches a ref
// directly to the underlying DOM input/select/textarea to read its value.
// Without forwardRef, React silently drops that ref, RHF never sees what
// was typed, and fields report "required" even when filled in.

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded border bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400',
        'focus:border-register-500 focus:outline-none focus:ring-1 focus:ring-register-500',
        invalid ? 'border-brick-400' : 'border-slate-200',
        className,
      )}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={clsx(
        'w-full rounded border bg-white px-3 py-2 text-sm text-ink',
        'focus:border-register-500 focus:outline-none focus:ring-1 focus:ring-register-500',
        invalid ? 'border-brick-400' : 'border-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})

export const Textarea = forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded border bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400',
        'focus:border-register-500 focus:outline-none focus:ring-1 focus:ring-register-500',
        invalid ? 'border-brick-400' : 'border-slate-200',
        className,
      )}
      {...props}
    />
  )
})
