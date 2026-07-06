import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Input } from '../../components/FormField'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ExpenseForm } from './ExpenseForm'
import { useFetch } from '../../hooks/useFetch'
import { expensesApi } from '../../api/expensesApi'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { EXPENSE_CATEGORY_LABELS } from '../../utils/constants'

const PIE_COLORS = ['#1F6F54', '#C68A2E', '#B3432E', '#6B7A73', '#2F8266', '#D89A3E', '#8B958F']

export default function Expenses() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchExpenses = useCallback(
    () => expensesApi.list({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [dateFrom, dateTo],
  )
  const { data: expenses, isLoading, refetch } = useFetch(fetchExpenses, [fetchExpenses])

  const fetchSummary = useCallback(() => expensesApi.monthlySummary(), [])
  const { data: summary } = useFetch(fetchSummary, [])

  const breakdown = (summary?.breakdown || []).map((b) => ({
    name: EXPENSE_CATEGORY_LABELS[b.categoryId] ?? b.categoryId,
    value: b.total,
  }))

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await expensesApi.update(editing.id, values)
        toast.success('Expense updated')
      } else {
        await expensesApi.create(values)
        toast.success('Expense created')
      }
      setFormOpen(false)
      refetch()
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setIsSubmitting(true)
    try {
      await expensesApi.remove(deleting.id)
      toast.success('Expense deleted')
      setDeleting(null)
      refetch()
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track and categorize store spending."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={16} /> New expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input type="date" className="max-w-[160px]" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-sm text-slate-400">to</span>
            <Input type="date" className="max-w-[160px]" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>

          <Table
            isLoading={isLoading}
            emptyMessage="No expenses recorded for this period."
            columns={[
              { key: 'date', header: 'Date', className: 'figure', render: (r) => formatDate(r.date) },
              {
                key: 'category',
                header: 'Category',
                render: (r) => EXPENSE_CATEGORY_LABELS[r.categoryId] ?? r.categoryId,
              },
              { key: 'note', header: 'Note' },
              { key: 'amount', header: 'Amount', className: 'figure', render: (r) => formatCurrency(r.amount) },
              {
                key: 'actions',
                header: '',
                className: 'text-right',
                render: (r) => (
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(r)
                        setFormOpen(true)
                      }}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-register-500"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(r)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brick-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ),
              },
            ]}
            rows={expenses}
          />
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="font-display text-base font-semibold text-ink">This month</h2>
          <p className="figure mt-1 text-2xl font-semibold text-ink">
            {formatCurrency(summary?.total)}
          </p>
          {breakdown.length > 0 && (
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                    {breakdown.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete expense"
        message="Delete this expense? This can't be undone."
        confirmLabel="Delete"
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
