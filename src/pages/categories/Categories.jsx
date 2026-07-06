import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { FormField, Input, Textarea } from '../../components/FormField'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'
import { categoriesApi } from '../../api/categoriesApi'
import { ROLES } from '../../utils/constants'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

function CategoryForm({ open, onClose, onSubmit, initialValues, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) reset(initialValues || { name: '', description: '' })
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? 'Edit category' : 'New category'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Name" error={errors.name?.message} required>
          <Input {...register('name')} />
        </FormField>
        <FormField label="Description" error={errors.description?.message}>
          <Textarea rows={3} {...register('description')} />
        </FormField>
      </form>
    </Modal>
  )
}

export default function Categories() {
  const { role } = useAuth()
  const canManage = role === ROLES.ADMIN || role === ROLES.MANAGER

  const fetchCategories = useCallback(() => categoriesApi.list(), [])
  const { data: categories, isLoading, refetch } = useFetch(fetchCategories, [])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await categoriesApi.update(editing.id, values)
        toast.success('Category updated')
      } else {
        await categoriesApi.create(values)
        toast.success('Category created')
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
      await categoriesApi.remove(deleting.id)
      toast.success('Category deleted')
      setDeleting(null)
      refetch()
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'productCount', header: 'Products', className: 'figure' },
  ]

  if (canManage) {
    columns.push({
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
            aria-label={`Edit ${r.name}`}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleting(r)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brick-500"
            aria-label={`Delete ${r.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    })
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group products for easier browsing and reporting."
        actions={
          canManage && (
            <Button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus size={16} /> New category
            </Button>
          )
        }
      />

      <Table columns={columns} rows={categories} isLoading={isLoading} emptyMessage="No categories yet." />

      {canManage && (
        <>
          <CategoryForm
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
            title="Delete category"
            message={`Delete "${deleting?.name}"? Products in this category will need to be reassigned.`}
            confirmLabel="Delete"
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  )
}
