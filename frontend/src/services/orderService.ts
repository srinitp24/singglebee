import api from '../lib/axios'

export interface CreateOrderDto {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  notes?: string
}

export interface OrderItemDto {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  price: number
  priceCents: number
  subtotal: number
  subtotalCents: number
}

export interface OrderDto {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  totalPrice: number
  totalPriceCents: number
  currency: string
  status: string
  paymentStatus: string
  notes?: string
  items: OrderItemDto[]
  createdAt: string
  updatedAt: string
}

export interface UpdateOrderStatusDto {
  status: string
  notes?: string
}

export const orderService = {
  createOrder: async (data: CreateOrderDto) => {
    const response = await api.post('/orders', data)
    return response.data
  },

  getMyOrders: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all')
    return response.data
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusDto) => {
    const response = await api.put(`/orders/${id}/status`, data)
    return response.data
  },

  cancelOrder: async (id: string) => {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  },
}
