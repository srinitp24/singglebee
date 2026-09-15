import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartService } from '../services/cartService'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productSku: string
  productImageUrl?: string
  quantity: number
  price: number
  priceCents: number
  subtotal: number
  subtotalCents: number
  availableStock: number
}

interface CartState {
  items: CartItem[]
  sessionId: string | null
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addItem: (item: CartItem) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: () => Promise<void>
  setSessionId: (sessionId: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: null,
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,

      syncCart: async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
          set({ isLoading: true })
          const response = await cartService.getCart()
          const cart = response.data

          set({
            items: cart.items.map((item: CartItem) => ({
              id: item.id,
              productId: item.productId,
              productName: item.productName,
              productSku: item.productSku,
              productImageUrl: item.productImageUrl,
              quantity: item.quantity,
              price: item.price,
              priceCents: item.priceCents,
              subtotal: item.subtotal,
              subtotalCents: item.subtotalCents,
              availableStock: item.availableStock,
            })),
            totalItems: cart.itemCount,
            totalPrice: cart.totalPrice,
            isLoading: false,
          })
        } catch (error) {
          console.error('Failed to sync cart:', error)
          set({ isLoading: false })
        }
      },

      addItem: async (item) => {
        const token = localStorage.getItem('token')
        
        if (token) {
          // Sync with backend
          try {
            set({ isLoading: true })
            const response = await cartService.addToCart({
              productId: item.productId,
              quantity: item.quantity,
            })
            
            const cart = response.data
            set({
              items: cart.items,
              totalItems: cart.itemCount,
              totalPrice: cart.totalPrice,
              isLoading: false,
            })
          } catch (error) {
            console.error('Failed to add to cart:', error)
            console.error('Error details:', (error as any)?.response?.data)
            set({ isLoading: false })
            throw error
          }
        } else {
          // Local storage only (guest user)
          const { items } = get()
          const existingItem = items.find((i) => i.productId === item.productId)
          
          let newItems: CartItem[]
          if (existingItem) {
            newItems = items.map((i) =>
              i.productId === item.productId
                ? { 
                    ...i, 
                    quantity: i.quantity + item.quantity,
                    subtotal: (i.quantity + item.quantity) * i.price,
                    subtotalCents: Math.round((i.quantity + item.quantity) * i.price * 100)
                  }
                : i
            )
          } else {
            newItems = [...items, item]
          }
          
          set({
            items: newItems,
            totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
          })
        }
      },

      updateQuantity: async (productId, quantity) => {
        const token = localStorage.getItem('token')
        
        if (token) {
          // Sync with backend
          try {
            set({ isLoading: true })
            const response = await cartService.updateCartItem(productId, { quantity })
            
            const cart = response.data
            set({
              items: cart.items,
              totalItems: cart.itemCount,
              totalPrice: cart.totalPrice,
              isLoading: false,
            })
          } catch (error) {
            console.error('Failed to update cart:', error)
            set({ isLoading: false })
            throw error
          }
        } else {
          // Local storage only
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }
          
          set({
            items: get().items.map((item) =>
              item.productId === productId
                ? { ...item, quantity, subtotal: item.price * quantity, subtotalCents: Math.round(item.price * quantity * 100) }
                : item
            ),
          })
          
          const items = get().items
          set({
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: items.reduce((sum, i) => sum + i.subtotal, 0),
          })
        }
      },

      removeItem: async (productId) => {
        const token = localStorage.getItem('token')
        
        if (token) {
          // Sync with backend
          try {
            set({ isLoading: true })
            await cartService.removeFromCart(productId)
            
            // Refresh cart
            await get().syncCart()
          } catch (error) {
            console.error('Failed to remove from cart:', error)
            set({ isLoading: false })
            throw error
          }
        } else {
          // Local storage only
          set({
            items: get().items.filter((item) => item.productId !== productId),
          })
          
          const items = get().items
          set({
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: items.reduce((sum, i) => sum + i.subtotal, 0),
          })
        }
      },

      clearCart: async () => {
        const token = localStorage.getItem('token')
        
        if (token) {
          // Clear backend cart
          try {
            await cartService.clearCart()
          } catch (error) {
            console.error('Failed to clear cart:', error)
          }
        }
        
        // Clear local state
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },

      setSessionId: (sessionId) => {
        set({ sessionId })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
