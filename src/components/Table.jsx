import { Inbox } from 'lucide-react'

/**
 * Simple, dependency-free table for small-to-medium data grids.
 * columns: [{ key, header, render?(row), className? }]
 */
export function Table({ columns, rows, isLoading, emptyMessage = 'Nothing to show yet.', rowKey = 'id' }) {
  if (isLoading) {
    return <TableSkeleton columns={columns.length} />
  }

  if (!rows || rows.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-2.5 text-ink-soft ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableSkeleton({ columns = 4, rows = 6 }) {
  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-6 border-b border-slate-100 px-4 py-3 last:border-0">
          {Array.from({ length: columns }).map((__, c) => (
            <div
              key={c}
              className="h-3 flex-1 animate-pulse rounded bg-slate-100"
              style={{ animationDelay: `${(r + c) * 40}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded border border-dashed border-slate-200 bg-white py-14 text-center">
      <Inbox size={28} className="text-slate-300" />
      <p className="text-sm text-slate-500">{message}</p>
      {action}
    </div>
  )
}
