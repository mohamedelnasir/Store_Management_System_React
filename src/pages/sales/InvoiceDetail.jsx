import { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { useFetch } from '../../hooks/useFetch'
import { salesApi } from '../../api/salesApi'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

export default function InvoiceDetail() {
  const { id } = useParams()
  const fetchSale = useCallback(() => salesApi.get(id), [id])
  const { data: sale, isLoading } = useFetch(fetchSale, [fetchSale])

  return (
    <div>
      <Link to="/sales" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={15} /> Back to sales history
      </Link>

      <PageHeader
        title={sale ? `Invoice ${sale.invoiceNumber}` : 'Invoice'}
        description={sale ? formatDateTime(sale.date) : undefined}
      />

      {!isLoading && sale && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoBlock label="Cashier" value={sale.cashierName} />
          <InfoBlock label="Items" value={sale.itemCount} mono />
          <InfoBlock label="Total" value={formatCurrency(sale.total)} mono />
          <InfoBlock label="Invoice #" value={sale.invoiceNumber} mono />
        </div>
      )}

      <Table
        isLoading={isLoading}
        emptyMessage="No line items found."
        columns={[
          { key: 'productName', header: 'Product' },
          { key: 'unitPrice', header: 'Unit price', className: 'figure', render: (r) => formatCurrency(r.unitPrice) },
          { key: 'quantity', header: 'Qty', className: 'figure' },
          {
            key: 'lineTotal',
            header: 'Line total',
            className: 'figure',
            render: (r) => formatCurrency(r.unitPrice * r.quantity),
          },
        ]}
        rows={sale?.items}
      />
    </div>
  )
}

function InfoBlock({ label, value, mono }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-sm font-medium text-ink ${mono ? 'figure' : ''}`}>{value}</div>
    </div>
  )
}
