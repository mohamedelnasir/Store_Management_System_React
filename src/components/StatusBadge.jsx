import clsx from 'clsx'

const tones = {
  ok: 'bg-register-50 text-register-700 border-register-100',
  warn: 'bg-amber-50 text-amber-600 border-amber-400/30',
  danger: 'bg-brick-50 text-brick-600 border-brick-400/30',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
}

export function StatusBadge({ tone = 'neutral', children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
