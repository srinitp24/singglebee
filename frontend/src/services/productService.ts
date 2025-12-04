import api from '../lib/axios'

export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  price: number
  priceCents: number
  currency: string
  stock: number
  category?: string
  ageGroup?: string
  language?: string
  imageUrl?: string
  rating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  success: boolean
  message: string
  data: {
    items: Product[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

export interface ProductResponse {
  success: boolean
  message: string
  data: Product
}

export const productService = {
  getAll: async (params?: {
    page?: number
    pageSize?: number
    category?: string
    ageGroup?: string
    language?: string
    search?: string
    activeOnly?: boolean
  }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  getBySku: async (sku: string): Promise<ProductResponse> => {
    const response = await api.get(`/products/sku/${sku}`)
    return response.data
  },

  create: async (data: Partial<Product>): Promise<ProductResponse> => {
    const response = await api.post('/products', data)
    return response.data
  },

  update: async (id: string, data: Partial<Product>): Promise<ProductResponse> => {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}
