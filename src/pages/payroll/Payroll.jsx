import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Select } from '../../components/FormField'
import { GeneratePayrollForm } from './GeneratePayrollForm'
import { useFetch } from '../../hooks/useFetch'
import { payrollApi } from '../../api/payrollApi'
import { employeesApi } from '../../api/employeesApi'
import { formatCurrency } from '../../utils/formatters'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Payroll() {
  const [employeeId, setEmployeeId] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEmployees = useCallback(() => employeesApi.list(), [])
  const { data: employees } = useFetch(fetchEmployees, [])

  const fetchPayroll = useCallback(
    () =>
      payrollApi.list({
        employeeId: employeeId || undefined,
        month: month || undefined,
        year: year || undefined,
      }),
    [employeeId, month, year],
  )
  const { data: records, isLoading, refetch } = useFetch(fetchPayroll, [fetchPayroll])

  async function handleGenerate(values) {
    setIsSubmitting(true)
    try {
      await payrollApi.generate(values)
      toast.success('Payroll generated')
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
        title="Payroll"
        description="Generate and review payslips."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={16} /> Generate payroll
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select className="max-w-[220px]" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
          <option value="">All employees</option>
          {(employees || []).map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
        <Select className="max-w-[160px]" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All months</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </Select>
        <Select className="max-w-[120px]" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - i
            return (
              <option key={y} value={y}>
                {y}
              </option>
            )
          })}
        </Select>
      </div>

      <Table
        isLoading={isLoading}
        emptyMessage="No payroll records match your filters."
        columns={[
          {
            key: 'employeeName',
            header: 'Employee',
            render: (r) => (
              <Link to={`/payroll/${r.id}`} className="text-register-600 hover:underline">
                {r.employeeName}
              </Link>
            ),
          },
          { key: 'period', header: 'Period', className: 'figure', render: (r) => `${MONTHS[r.month - 1]} ${r.year}` },
          { key: 'baseSalary', header: 'Base', className: 'figure', render: (r) => formatCurrency(r.baseSalary) },
          { key: 'bonus', header: 'Bonus', className: 'figure', render: (r) => formatCurrency(r.bonus) },
          { key: 'deduction', header: 'Deduction', className: 'figure', render: (r) => formatCurrency(r.deduction) },
          { key: 'netSalary', header: 'Net salary', className: 'figure', render: (r) => formatCurrency(r.netSalary) },
        ]}
        rows={records}
      />

      <GeneratePayrollForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleGenerate}
        employees={employees || []}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
