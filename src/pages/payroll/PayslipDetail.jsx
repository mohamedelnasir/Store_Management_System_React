import { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { useFetch } from '../../hooks/useFetch'
import { payrollApi } from '../../api/payrollApi'
import { formatCurrency } from '../../utils/formatters'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function Row({ label, value, emphasize }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`figure text-sm ${emphasize ? 'text-lg font-semibold text-ink' : 'text-ink-soft'}`}>
        {value}
      </span>
    </div>
  )
}

export default function PayslipDetail() {
  const { id } = useParams()
  const fetchPayslip = useCallback(() => payrollApi.get(id), [id])
  const { data: payslip, isLoading } = useFetch(fetchPayslip, [fetchPayslip])

  return (
    <div>
      <Link to="/payroll" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={15} /> Back to payroll
      </Link>

      <PageHeader
        title={payslip ? `Payslip — ${payslip.employeeName}` : 'Payslip'}
        description={payslip ? `${MONTHS[payslip.month - 1]} ${payslip.year}` : undefined}
      />

      {isLoading && <div className="h-64 animate-pulse rounded-md border border-slate-200 bg-white" />}

      {!isLoading && payslip && (
        <div className="max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <Row label="Base salary" value={formatCurrency(payslip.baseSalary)} />
          <Row label="Bonus" value={`+ ${formatCurrency(payslip.bonus)}`} />
          <Row label="Deduction" value={`− ${formatCurrency(payslip.deduction)}`} />
          <Row label="Net salary" value={formatCurrency(payslip.netSalary)} emphasize />
        </div>
      )}
    </div>
  )
}
