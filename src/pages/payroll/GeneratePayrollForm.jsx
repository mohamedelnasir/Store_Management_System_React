import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input, Select } from '../../components/FormField'
import { formatCurrency } from '../../utils/formatters'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const schema = z.object({
  employeeId: z.string().min(1, 'Choose an employee'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  bonus: z.coerce.number().nonnegative('Must be 0 or more'),
  deduction: z.coerce.number().nonnegative('Must be 0 or more'),
})

export function GeneratePayrollForm({ open, onClose, onSubmit, employees, isSubmitting }) {
  const now = new Date()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: '',
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      bonus: 0,
      deduction: 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        employeeId: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        bonus: 0,
        deduction: 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset])

  const employeeId = useWatch({ control, name: 'employeeId' })
  const bonus = useWatch({ control, name: 'bonus' })
  const deduction = useWatch({ control, name: 'deduction' })

  const baseSalary = useMemo(
    () => employees.find((e) => String(e.id) === String(employeeId))?.salary ?? 0,
    [employees, employeeId],
  )
  const netSalary = Number(baseSalary || 0) + Number(bonus || 0) - Number(deduction || 0)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate payroll"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Generating…' : 'Generate payroll'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Employee" error={errors.employeeId?.message} required>
          <Select {...register('employeeId')}>
            <option value="">Select an employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {formatCurrency(e.salary)}/mo
              </option>
            ))}
          </Select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Month" error={errors.month?.message} required>
            <Select {...register('month')}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Year" error={errors.year?.message} required>
            <Input type="number" {...register('year')} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Bonus" error={errors.bonus?.message}>
            <Input type="number" step="0.01" {...register('bonus')} />
          </FormField>
          <FormField label="Deduction" error={errors.deduction?.message}>
            <Input type="number" step="0.01" {...register('deduction')} />
          </FormField>
        </div>

        <div className="rounded-md border border-register-100 bg-register-50 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-register-600">
            Computed net salary
          </div>
          <div className="figure mt-1 text-xl font-semibold text-register-700">
            {formatCurrency(netSalary)}
          </div>
        </div>
      </form>
    </Modal>
  )
}
