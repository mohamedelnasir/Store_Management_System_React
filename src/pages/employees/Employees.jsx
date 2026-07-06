import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Input } from '../../components/FormField'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { EmployeeForm } from './EmployeeForm'
import { useFetch } from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import { employeesApi } from '../../api/employeesApi'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function Employees() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEmployees = useCallback(
    () => employeesApi.list({ search: debouncedSearch || undefined }),
    [debouncedSearch],
  )
  const { data: employees, isLoading, refetch } = useFetch(fetchEmployees, [fetchEmployees])

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await employeesApi.update(editing.id, values)
        toast.success('Employee updated')
      } else {
        await employeesApi.create(values)
        toast.success('Employee created')
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
      await employeesApi.remove(deleting.id)
      toast.success('Employee removed')
      setDeleting(null)
      refetch()
    } catch {
      // Interceptor surfaces the backend's message, e.g. when payroll history exists.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage staff records."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={16} /> New employee
          </Button>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search employees…"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        isLoading={isLoading}
        emptyMessage="No employees found."
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'position', header: 'Position' },
          { key: 'phone', header: 'Phone', className: 'figure' },
          { key: 'salary', header: 'Salary', className: 'figure', render: (r) => formatCurrency(r.salary) },
          { key: 'hireDate', header: 'Hired', className: 'figure', render: (r) => formatDate(r.hireDate) },
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
        rows={employees}
      />

      <EmployeeForm
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
        title="Remove employee"
        message={`Remove "${deleting?.name}"? This is blocked if they have payroll history.`}
        confirmLabel="Remove"
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
