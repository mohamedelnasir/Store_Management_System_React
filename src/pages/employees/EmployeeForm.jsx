import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input } from '../../components/FormField'
import { toInputDate } from '../../utils/formatters'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.coerce.number().positive('Must be greater than 0'),
  hireDate: z.string().min(1, 'Hire date is required'),
})

export function EmployeeForm({ open, onClose, onSubmit, initialValues, isSubmitting }) {
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
          ? { ...initialValues, hireDate: toInputDate(initialValues.hireDate) }
          : { name: '', phone: '', position: '', salary: 0, hireDate: toInputDate(new Date()) },
      )
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? 'Edit employee' : 'New employee'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save employee'}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Name" error={errors.name?.message} required>
          <Input {...register('name')} />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message} required>
          <Input {...register('phone')} />
        </FormField>
        <FormField label="Position" error={errors.position?.message} required>
          <Input {...register('position')} />
        </FormField>
        <FormField label="Salary" error={errors.salary?.message} required>
          <Input type="number" step="0.01" {...register('salary')} />
        </FormField>
        <FormField label="Hire date" error={errors.hireDate?.message} required>
          <Input type="date" {...register('hireDate')} />
        </FormField>
      </form>
    </Modal>
  )
}
