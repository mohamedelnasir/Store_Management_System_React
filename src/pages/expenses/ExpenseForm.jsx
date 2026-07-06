import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input, Select, Textarea } from '../../components/FormField'
import { EXPENSE_CATEGORY_LABELS } from '../../utils/constants'
import { toInputDate } from '../../utils/formatters'

const schema = z.object({
  categoryId: z.coerce.number(),
  amount: z.coerce.number().positive('Must be greater than 0'),
  note: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
})

export function ExpenseForm({ open, onClose, onSubmit, initialValues, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? { ...initialValues, date: toInputDate(initialValues.date) }
          : { categoryId: 0, amount: 0, note: '', date: toInputDate(new Date()) },
      )
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? 'Edit expense' : 'New expense'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save expense'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Category" error={errors.categoryId?.message} required>
          <Select {...register('categoryId')}>
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Amount" error={errors.amount?.message} required>
          <Input type="number" step="0.01" {...register('amount')} />
        </FormField>
        <FormField label="Date" error={errors.date?.message} required>
          <Input type="date" {...register('date')} />
        </FormField>
        <FormField label="Note" error={errors.note?.message}>
          <Textarea rows={2} {...register('note')} />
        </FormField>
      </form>
    </Modal>
  )
}
