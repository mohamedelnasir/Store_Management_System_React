import { useCallback, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Download } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Select, Input } from '../../components/FormField'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'
import { reportsApi } from '../../api/reportsApi'
import { formatCurrency, formatDate } from '../../utils/formatters'
import {
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  REPORT_PERIODS,
  ROLES,
} from '../../utils/constants'

const REPORT_FETCHERS = {
  [REPORT_TYPES.SALES]: reportsApi.sales,
  [REPORT_TYPES.EXPENSES]: reportsApi.expenses,
  [REPORT_TYPES.INVENTORY]: reportsApi.inventory,
  [REPORT_TYPES.PAYROLL]: reportsApi.payroll,
  [REPORT_TYPES.PROFIT_AND_LOSS]: reportsApi.profitAndLoss,
}

const COLUMNS_BY_TYPE = {
  [REPORT_TYPES.SALES]: [
    { key: 'date', header: 'Date', className: 'figure', render: (r) => formatDate(r.date) },
    { key: 'invoiceCount', header: 'Invoices', className: 'figure' },
    { key: 'total', header: 'Total', className: 'figure', render: (r) => formatCurrency(r.total) },
  ],
  [REPORT_TYPES.EXPENSES]: [
    { key: 'date', header: 'Date', className: 'figure', render: (r) => formatDate(r.date) },
    { key: 'category', header: 'Category' },
    { key: 'total', header: 'Total', className: 'figure', render: (r) => formatCurrency(r.total) },
  ],
  [REPORT_TYPES.INVENTORY]: [
    { key: 'productName', header: 'Product' },
    { key: 'purchased', header: 'Purchased', className: 'figure' },
    { key: 'sold', header: 'Sold', className: 'figure' },
    { key: 'adjusted', header: 'Adjusted', className: 'figure' },
    { key: 'endingQuantity', header: 'Ending qty', className: 'figure' },
  ],
  [REPORT_TYPES.PAYROLL]: [
    { key: 'employeeName', header: 'Employee' },
    { key: 'baseSalary', header: 'Base', className: 'figure', render: (r) => formatCurrency(r.baseSalary) },
    { key: 'bonus', header: 'Bonus', className: 'figure', render: (r) => formatCurrency(r.bonus) },
    { key: 'deduction', header: 'Deduction', className: 'figure', render: (r) => formatCurrency(r.deduction) },
    { key: 'netSalary', header: 'Net', className: 'figure', render: (r) => formatCurrency(r.netSalary) },
  ],
  [REPORT_TYPES.PROFIT_AND_LOSS]: [
    { key: 'period', header: 'Period' },
    { key: 'revenue', header: 'Revenue', className: 'figure', render: (r) => formatCurrency(r.revenue) },
    { key: 'expenses', header: 'Expenses', className: 'figure', render: (r) => formatCurrency(r.expenses) },
    { key: 'profit', header: 'Profit', className: 'figure', render: (r) => formatCurrency(r.profit) },
  ],
}

export default function Reports() {
  const { role } = useAuth()
  const [reportType, setReportType] = useState(REPORT_TYPES.SALES)
  const [period, setPeriod] = useState(REPORT_PERIODS.MONTHLY)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const availableTypes = Object.values(REPORT_TYPES).filter(
    (t) => t !== REPORT_TYPES.PAYROLL || role === ROLES.ADMIN,
  )

  const fetchReport = useCallback(() => {
    const fetcher = REPORT_FETCHERS[reportType]
    return fetcher({
      period,
      dateFrom: period === REPORT_PERIODS.CUSTOM ? dateFrom || undefined : undefined,
      dateTo: period === REPORT_PERIODS.CUSTOM ? dateTo || undefined : undefined,
    })
  }, [reportType, period, dateFrom, dateTo])
  const { data, isLoading } = useFetch(fetchReport, [fetchReport])

  const rows = data?.rows || data || []
  const chartData = data?.chart

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Run reports across sales, expenses, inventory, payroll, and profit & loss."
        actions={
          <Button variant="secondary">
            <Download size={16} /> Export CSV
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select className="max-w-[220px]" value={reportType} onChange={(e) => setReportType(e.target.value)}>
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {REPORT_TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
        <Select className="max-w-[160px]" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value={REPORT_PERIODS.DAILY}>Daily</option>
          <option value={REPORT_PERIODS.WEEKLY}>Weekly</option>
          <option value={REPORT_PERIODS.MONTHLY}>Monthly</option>
          <option value={REPORT_PERIODS.CUSTOM}>Custom range</option>
        </Select>
        {period === REPORT_PERIODS.CUSTOM && (
          <>
            <Input type="date" className="max-w-[160px]" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-sm text-slate-400">to</span>
            <Input type="date" className="max-w-[160px]" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </>
        )}
      </div>

      {chartData && chartData.length > 0 && (
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADDD7" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7A73' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7A73' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="value" fill="#1F6F54" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Table
        isLoading={isLoading}
        emptyMessage="No data for this report and period."
        columns={COLUMNS_BY_TYPE[reportType]}
        rows={rows}
      />
    </div>
  )
}
