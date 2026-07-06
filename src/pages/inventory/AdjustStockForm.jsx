import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { FormField, Input, Select, Textarea } from '../../components/FormField'
import { INVENTORY_TRANSACTION_TYPES, INVENTORY_TRANSACTION_LABELS } from '../../utils/constants'

const schema = z.object({
  productId: z.string().min(1, 'Choose a product'),
  type: z.coerce.number(),
  quantity: z.coerce.number().int().refine((v) => v !== 0, 'Quantity cannot be zero'),
  note: z.string().optional(),
})

export function AdjustStockForm({ open, onClose, onSubmit, products, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { productId: '', type: INVENTORY_TRANSACTION_TYPES.PURCHASE, quantity: 0, note: '' },
  })

  useEffect(() => {
    if (open) reset({ productId: '', type: INVENTORY_TRANSACTION_TYPES.PURCHASE, quantity: 0, note: '' })
  }, [open, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adjust stock"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save adjustment'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Product" error={errors.productId?.message} required>
          <Select {...register('productId')}>
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Type" error={errors.type?.message} required>
          <Select {...register('type')}>
            {Object.entries(INVENTORY_TRANSACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Quantity"
          error={errors.quantity?.message}
          hint="Positive to add stock, negative to remove (e.g. -3 for damaged goods)."
          required
        >
          <Input type="number" {...register('quantity')} />
        </FormField>
        <FormField label="Note" error={errors.note?.message}>
          <Textarea rows={2} {...register('note')} />
        </FormField>
      </form>
    </Modal>
  )
}
