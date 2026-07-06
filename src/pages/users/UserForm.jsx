import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input, Select } from '../../components/FormField'
import { ROLE_LABELS } from '../../utils/constants'

function buildSchema(isEditing) {
  return z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email address'),
    password: isEditing
      ? z.string().optional().or(z.literal(''))
      : z.string().min(8, 'Password must be at least 8 characters'),
    role: z.coerce.number(),
  })
}

export function UserForm({ open, onClose, onSubmit, initialValues, isSubmitting }) {
  const isEditing = Boolean(initialValues)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(buildSchema(isEditing)) })

  useEffect(() => {
    if (open) {
      reset(initialValues ? { ...initialValues, password: '' } : { name: '', email: '', password: '', role: 2 })
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit user' : 'New user'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save user'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Name" error={errors.name?.message} required>
          <Input {...register('name')} />
        </FormField>
        <FormField label="Email" error={errors.email?.message} required>
          <Input type="email" {...register('email')} />
        </FormField>
        <FormField
          label="Password"
          error={errors.password?.message}
          hint={isEditing ? 'Leave blank to keep the current password.' : undefined}
          required={!isEditing}
        >
          <Input type="password" {...register('password')} />
        </FormField>
        <FormField label="Role" error={errors.role?.message} required>
          <Select {...register('role')}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
      </form>
    </Modal>
  )
}
