import api from '../lib/axios'

export interface CartItemDto {
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

export interface CartDto {
  id: string
  userId?: string
  sessionId?: string
  items: CartItemDto[]
  totalPrice: number
  totalPriceCents: number
  itemCount: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface AddToCartDto {
  productId: string
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },

  addToCart: async (data: AddToCartDto) => {
    const response = await api.post('/cart/items', data)
    return response.data
  },

  updateCartItem: async (productId: string, data: UpdateCartItemDto) => {
    const response = await api.put(`/cart/items/${productId}`, data)
    return response.data
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/cart/items/${productId}`)
    return response.data
  },

  clearCart: async () => {
    const response = await api.delete('/cart')
    return response.data
  },
}
