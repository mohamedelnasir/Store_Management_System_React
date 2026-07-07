import { useCallback, useState } from 'react'
import { PackagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Select } from '../../components/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { AdjustStockForm } from './AdjustStockForm'
import { useFetch } from '../../hooks/useFetch'
import { inventoryApi } from '../../api/inventoryApi'
import { productsApi } from '../../api/productsApi'
import { formatDateTime } from '../../utils/formatters'
import { INVENTORY_TRANSACTION_LABELS } from '../../utils/constants'

export default function Inventory() {
  const [productId, setProductId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = useCallback(() => productsApi.list(), [])
  const { data: products } = useFetch(fetchProducts, [])

  const fetchHistory = useCallback(
    () => inventoryApi.history({ productId: productId || undefined }),
    [productId],
  )
  const { data: history, isLoading, refetch } = useFetch(fetchHistory, [fetchHistory])

  const fetchLowStock = useCallback(() => inventoryApi.lowStock(), [])
  const { data: lowStock } = useFetch(fetchLowStock, [])

  async function handleAdjust(values) {
    setIsSubmitting(true)
    try {
      await inventoryApi.adjust(values)
      toast.success('Stock adjusted')
      setFormOpen(false)
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
        title="Inventory"
        description="Track stock movements and adjust quantities."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <PackagePlus size={16} /> Adjust stock
          </Button>
        }
      />

      {lowStock && lowStock.length > 0 && (
        <div className="mb-6 rounded-md border border-amber-400/30 bg-amber-50 px-4 py-3 text-sm text-amber-600">
          <span className="font-medium">{lowStock.length}</span> product
          {lowStock.length === 1 ? '' : 's'} running low on stock — check the Products page to
          reorder.
        </div>
      )}

      <div className="mb-4 max-w-xs">
        <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">All products</option>
          {(products || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </Select>
      </div>

      <Table
        isLoading={isLoading}
        emptyMessage="No inventory movements recorded yet."
        columns={[
          { key: 'createdAt', header: 'Date', className: 'figure', render: (r) => formatDateTime(r.createdAt) },
          { key: 'product', header: 'Product', render: (r) => r.productName },
          {
            key: 'type',
            header: 'Type',
            render: (r) => r.type,
          },
          {
            key: 'quantityChange',
            header: 'Quantity',
            className: 'figure',
            render: (r) => (r.quantityChange > 0 ? `+${r.quantityChange}` : r.quantityChange),
          },
          { key: 'note', header: 'Note' },
        ]}
        rows={history}
      />

      <AdjustStockForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdjust}
        products={products || []}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
