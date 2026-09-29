import api from '../lib/axios'
import type { ProductReview, CreateReviewRequest, ProductReviewSummary, CanReviewProduct } from '../types/review'

export const reviewService = {
  async createReview(data: CreateReviewRequest) {
    const response = await api.post<{ success: boolean; data: ProductReview; message: string }>(
      '/reviews',
      data
    )
    return response.data
  },

  async getProductReviews(productId: string, page = 1, pageSize = 10) {
    const response = await api.get<{ success: boolean; data: ProductReview[] }>(
      `/reviews/product/${productId}`,
      { params: { page, pageSize } }
    )
    return response.data
  },

  async getProductReviewSummary(productId: string) {
    const response = await api.get<{ success: boolean; data: ProductReviewSummary }>(
      `/reviews/product/${productId}/summary`
    )
    return response.data
  },

  async canUserReviewProduct(productId: string, orderId: string) {
    const response = await api.get<{ success: boolean; data: CanReviewProduct }>(
      '/reviews/can-review',
      { params: { productId, orderId } }
    )
    return response.data
  },

  async getReviewableProducts(orderId: string) {
    const response = await api.get<{ success: boolean; data: string[] }>(
      `/reviews/order/${orderId}/reviewable-products`
    )
    return response.data
  },
}
