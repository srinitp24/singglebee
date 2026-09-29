export interface ProductReview {
  id: string
  productId: string
  rating: number
  reviewText?: string
  isVerifiedPurchase: boolean
  createdAt: string
  reviewerName: string
}

export interface CreateReviewRequest {
  productId: string
  orderId: string
  rating: number
  reviewText?: string
}

export interface ProductReviewSummary {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
}

export interface CanReviewProduct {
  productId: string
  orderId: string
  canReview: boolean
  reason?: string
}
