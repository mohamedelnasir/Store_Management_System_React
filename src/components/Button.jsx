import clsx from 'clsx'

const variants = {
  primary: 'bg-register-500 text-paper hover:bg-register-600 disabled:bg-register-100',
  secondary: 'bg-transparent border border-slate-200 text-ink hover:bg-slate-50',
  danger: 'bg-brick-500 text-paper hover:bg-brick-600 disabled:bg-brick-50',
  ghost: 'bg-transparent text-ink hover:bg-slate-50',
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
