import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Input, Select } from '../../components/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ProductForm } from './ProductForm'
import { useFetch } from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import { useAuth } from '../../hooks/useAuth'
import { productsApi } from '../../api/productsApi'
import { categoriesApi } from '../../api/categoriesApi'
import { formatCurrency } from '../../utils/formatters'
import { ROLES } from '../../utils/constants'

export default function Products() {
  const { role } = useAuth()
  const canManage = role === ROLES.ADMIN || role === ROLES.MANAGER

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const debouncedSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = useCallback(
    () =>
      productsApi.list({
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        lowStockOnly: lowStockOnly || undefined,
      }),
    [debouncedSearch, categoryId, lowStockOnly],
  )
  const { data: products, isLoading, refetch } = useFetch(fetchProducts, [fetchProducts])

  const fetchCategories = useCallback(() => categoriesApi.list(), [])
  const { data: categories } = useFetch(fetchCategories, [])

  function openCreate() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEdit(product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, values)
        toast.success('Product updated')
      } else {
        await productsApi.create(values)
        toast.success('Product created')
      }
      setFormOpen(false)
      refetch()
    } catch {
      // Interceptor already toasts the server error message.
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return
    setIsSubmitting(true)
    try {
      await productsApi.remove(deletingProduct.id)
      toast.success('Product deleted')
      setDeletingProduct(null)
      refetch()
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'sku', header: 'SKU', className: 'figure' },
    { key: 'category', header: 'Category', render: (r) => r.categoryName },
    { key: 'sellPrice', header: 'Price', className: 'figure', render: (r) => formatCurrency(r.sellPrice) },
    { key: 'quantity', header: 'Qty', className: 'figure' },
    {
      key: 'status',
      header: 'Status',
      render: (r) =>
        r.quantity <= r.lowStockThreshold ? (
          <StatusBadge tone={r.quantity === 0 ? 'danger' : 'warn'}>
            {r.quantity === 0 ? 'Out of stock' : 'Low stock'}
          </StatusBadge>
        ) : (
          <StatusBadge tone="ok">In stock</StatusBadge>
        ),
    },
  ]

  if (canManage) {
    columns.push({
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(r)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-register-500"
            aria-label={`Edit ${r.name}`}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeletingProduct(r)}
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
        title="Products"
        description={canManage ? 'Manage your catalog and stock levels.' : 'Browse the product catalog.'}
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus size={16} /> New product
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search products…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="max-w-[200px]"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="rounded border-slate-300 text-register-500 focus:ring-register-500"
          />
          Low stock only
        </label>
      </div>

      <Table
        columns={columns}
        rows={products}
        isLoading={isLoading}
        emptyMessage="No products match your filters."
      />

      {canManage && (
        <>
          <ProductForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmit}
            initialValues={editingProduct}
            categories={categories || []}
            isSubmitting={isSubmitting}
          />
          <ConfirmDialog
            open={Boolean(deletingProduct)}
            onClose={() => setDeletingProduct(null)}
            onConfirm={handleDelete}
            title="Delete product"
            message={`Delete "${deletingProduct?.name}"? This can't be undone.`}
            confirmLabel="Delete"
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  )
}
