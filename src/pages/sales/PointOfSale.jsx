import { useCallback, useMemo, useState } from 'react'
import { Search, Trash2, Plus, Minus, Receipt } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/Button'
import { Input } from '../../components/FormField'
import { useFetch } from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import { productsApi } from '../../api/productsApi'
import { salesApi } from '../../api/salesApi'
import { formatCurrency } from '../../utils/formatters'

export default function PointOfSale() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [cart, setCart] = useState([]) // [{ productId, name, sku, sellPrice, quantity, available }]
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = useCallback(
    () => productsApi.list({ search: debouncedSearch || undefined }),
    [debouncedSearch],
  )
  const { data: products, isLoading } = useFetch(fetchProducts, [fetchProducts])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.sellPrice * item.quantity, 0),
    [cart],
  )

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        if (existing.quantity >= product.quantity) {
          toast.error(`Only ${product.quantity} left of ${product.name}`)
          return prev
        }
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      if (product.quantity <= 0) {
        toast.error(`${product.name} is out of stock`)
        return prev
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          sellPrice: product.sellPrice,
          quantity: 1,
          available: product.quantity,
        },
      ]
    })
  }

  function updateQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item
          const next = item.quantity + delta
          if (next > item.available) {
            toast.error(`Only ${item.available} left of ${item.name}`)
            return item
          }
          return { ...item, quantity: next }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }

  async function handleCheckout() {
    if (cart.length === 0) return
    setIsSubmitting(true)
    try {
      await salesApi.create({
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      })
      toast.success('Sale recorded')
      setCart([])
    } catch {
      // handled by interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Point of Sale" description="Search products, build the cart, and check out." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product search + results */}
        <div className="lg:col-span-2">
          <div className="relative mb-4 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, SKU, or barcode…"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md border border-slate-200 bg-white" />
              ))}
            {!isLoading &&
              (products || []).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.quantity <= 0}
                  className="flex flex-col items-start rounded-md border border-slate-200 bg-white p-3 text-left transition-colors hover:border-register-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                  <span className="figure mt-1 text-xs text-slate-400">{p.sku}</span>
                  <span className="figure mt-2 text-sm font-semibold text-register-600">
                    {formatCurrency(p.sellPrice)}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    {p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'}
                  </span>
                </button>
              ))}
            {!isLoading && (products || []).length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-slate-500">
                No products match your search.
              </p>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Receipt size={16} className="text-register-500" />
            <h2 className="font-display text-base font-semibold text-ink">Current sale</h2>
          </div>

          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Cart is empty. Tap a product to add it.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{item.name}</p>
                    <p className="figure text-xs text-slate-400">{formatCurrency(item.sellPrice)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="figure w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-1 rounded p-1 text-slate-400 hover:text-brick-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-ink-soft">Total</span>
            <span className="figure text-lg font-semibold text-ink">{formatCurrency(total)}</span>
          </div>

          <Button
            className="mt-4 w-full"
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleCheckout}
          >
            {isSubmitting ? 'Processing…' : 'Complete sale'}
          </Button>
        </div>
      </div>
    </div>
  )
}
