import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Input } from '../../components/FormField'
import { useFetch } from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import { salesApi } from '../../api/salesApi'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

export default function SalesHistory() {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const debouncedInvoice = useDebounce(invoiceNumber)

  const fetchSales = useCallback(
    () =>
      salesApi.list({
        invoiceNumber: debouncedInvoice || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [debouncedInvoice, dateFrom, dateTo],
  )
  const { data: sales, isLoading } = useFetch(fetchSales, [fetchSales])

  return (
    <div>
      <PageHeader title="Sales history" description="Every sale recorded at the register." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Invoice number…"
          className="max-w-[200px]"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
        <Input type="date" className="max-w-[160px]" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <span className="text-sm text-slate-400">to</span>
        <Input type="date" className="max-w-[160px]" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      <Table
        isLoading={isLoading}
        emptyMessage="No sales match your filters."
        columns={[
          {
            key: 'invoiceNumber',
            header: 'Invoice #',
            className: 'figure',
            render: (r) => (
              <Link to={`/sales/${r.id}`} className="text-register-600 hover:underline">
                {r.invoiceNumber}
              </Link>
            ),
          },
          { key: 'createdAt', header: 'Date', className: 'figure', render: (r) => formatDateTime(r.createdAt) },
          { key: 'createdByUserName', header: 'Cashier', render: (r) => r.createdByUserName },
          { key: 'items', header: 'Items', className: 'figure', render: (r) => r.items.length },
          { key: 'total', header: 'Total', className: 'figure', render: (r) => formatCurrency(r.total) },
        ]}
        rows={sales}
      />
    </div>
  )
}
