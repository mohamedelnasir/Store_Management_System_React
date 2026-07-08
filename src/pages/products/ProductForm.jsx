import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input, Select, Textarea } from '../../components/FormField'

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    categoryId: z.string().min(1, 'Choose a category'),
    buyPrice: z.coerce.number().nonnegative('Must be 0 or more'),
    sellPrice: z.coerce.number().nonnegative('Must be 0 or more'),
    quantity: z.coerce.number().int().nonnegative('Must be 0 or more'),
    lowStockThreshold: z.coerce.number().int().nonnegative('Must be 0 or more'),
    description: z.string().optional(),
  })
  .refine((data) => data.sellPrice > data.buyPrice, {
    message: 'Sell price must be greater than buy price',
    path: ['sellPrice'],
  })

export function ProductForm({ open, onClose, onSubmit, initialValues, categories, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(
        initialValues || {
          name: '',
          sku: '',
          barcode: '',
          categoryId: '',
          buyPrice: 0,
          sellPrice: 0,
          quantity: 0,
          lowStockThreshold: 5,
          description: '',
        },
      )
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? 'Edit product' : 'New product'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save product'}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Name" error={errors.name?.message} required>
          <Input {...register('name')} />
        </FormField>
        <FormField label="SKU" error={errors.sku?.message} required>
          <Input {...register('sku')} />
        </FormField>
        <FormField label="Barcode" error={errors.barcode?.message}>
          <Input {...register('barcode')} />
        </FormField>
        <FormField label="Category" error={errors.categoryNme?.message} required>
          <Select {...register('categoryId')}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Buy price" error={errors.buyPrice?.message} required>
          <Input type="number" step="0.01" {...register('buyPrice')} />
        </FormField>
        <FormField label="Sell price" error={errors.sellPrice?.message} required>
          <Input type="number" step="0.01" {...register('sellPrice')} />
        </FormField>
        <FormField label="Quantity" error={errors.quantity?.message} required>
          <Input type="number" {...register('quantity')} />
        </FormField>
        <FormField label="Low-stock threshold" error={errors.lowStockThreshold?.message} required>
          <Input type="number" {...register('lowStockThreshold')} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Description" error={errors.description?.message}>
            <Textarea rows={3} {...register('description')} />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}
