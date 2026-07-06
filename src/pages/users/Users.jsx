import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Input } from '../../components/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { UserForm } from './UserForm'
import { useFetch } from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import { usersApi } from '../../api/usersApi'
import { ROLE_LABELS } from '../../utils/constants'

export default function Users() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deactivating, setDeactivating] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = useCallback(
    () => usersApi.list({ search: debouncedSearch || undefined }),
    [debouncedSearch],
  )
  const { data: users, isLoading, refetch } = useFetch(fetchUsers, [fetchUsers])

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      const payload = { ...values }
      if (editing && !payload.password) delete payload.password
      if (editing) {
        await usersApi.update(editing.id, payload)
        toast.success('User updated')
      } else {
        await usersApi.create(payload)
        toast.success('User created')
      }
      setFormOpen(false)
      refetch()
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeactivate() {
    if (!deactivating) return
    setIsSubmitting(true)
    try {
      await usersApi.remove(deactivating.id)
      toast.success('User deactivated')
      setDeactivating(null)
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
        title="Users"
        description="Manage who can sign in and what they can do."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={16} /> New user
          </Button>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search users…"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        isLoading={isLoading}
        emptyMessage="No users found."
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'role',
            header: 'Role',
            render: (r) => <StatusBadge tone="neutral">{ROLE_LABELS[r.role]}</StatusBadge>,
          },
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
                  onClick={() => setDeactivating(r)}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brick-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
        rows={users}
      />

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={Boolean(deactivating)}
        onClose={() => setDeactivating(null)}
        onConfirm={handleDeactivate}
        title="Deactivate user"
        message={`Deactivate "${deactivating?.name}"? They will no longer be able to sign in.`}
        confirmLabel="Deactivate"
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
