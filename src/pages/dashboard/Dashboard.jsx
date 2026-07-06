import { useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { StatusBadge } from '../../components/StatusBadge'
import { useFetch } from '../../hooks/useFetch'
import { dashboardApi } from '../../api/dashboardApi'
import { formatCurrency, formatNumber } from '../../utils/formatters'

function SummaryCard({ label, value, receiptEdge }) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white p-4 shadow-card ${
        receiptEdge ? 'receipt-edge mb-2' : ''
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="figure mt-1.5 text-xl font-semibold text-ink">{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const fetchSummary = useCallback(() => dashboardApi.summary(), [])
  const { data, isLoading } = useFetch(fetchSummary, [])

  const summary = data || {}
  const lowStock = summary.lowStockProducts || []
  const trend = summary.salesTrend || []

  const cards = [
    { label: "Today's Sales", value: formatCurrency(summary.todaysSales) },
    { label: 'Monthly Sales', value: formatCurrency(summary.monthlySales) },
    { label: 'Total Sales', value: formatCurrency(summary.totalSales) },
    { label: 'Total Expenses', value: formatCurrency(summary.totalExpenses) },
    { label: 'Total Profit', value: formatCurrency(summary.totalProfit) },
    { label: 'Total Products', value: formatNumber(summary.totalProducts) },
    { label: 'Total Employees', value: formatNumber(summary.totalEmployees) },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" description="A snapshot of how the store is doing." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-[76px] animate-pulse rounded-md border border-slate-200 bg-white" />
            ))
          : cards.map((c, i) => <SummaryCard key={c.label} {...c} receiptEdge={i === cards.length - 1} />)}
      </div>

      {trend.length > 0 && (
        <div className="mt-8 rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-base font-semibold text-ink">Sales trend</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADDD7" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7A73' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7A73' }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ fontSize: 12, borderRadius: 6 }}
                />
                <Line type="monotone" dataKey="total" stroke="#1F6F54" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Low-stock products</h2>
        <Table
          isLoading={isLoading}
          emptyMessage="No products are running low right now."
          columns={[
            { key: 'name', header: 'Product' },
            { key: 'sku', header: 'SKU' },
            {
              key: 'quantity',
              header: 'Quantity',
              className: 'figure',
              render: (row) => row.quantity,
            },
            { key: 'lowStockThreshold', header: 'Threshold', className: 'figure' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <StatusBadge tone={row.quantity === 0 ? 'danger' : 'warn'}>
                  {row.quantity === 0 ? 'Out of stock' : 'Low stock'}
                </StatusBadge>
              ),
            },
          ]}
          rows={lowStock}
        />
      </div>
    </div>
  )
}
