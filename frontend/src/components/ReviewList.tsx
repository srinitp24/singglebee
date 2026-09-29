import { Box, VStack, HStack, Text, Badge, Divider, Button, Spinner, Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import StarRating from './StarRating'
import { reviewService } from '../services/reviewService'
import type { ProductReview } from '../types/review'

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['productReviews', productId, page],
    queryFn: () => reviewService.getProductReviews(productId, page, pageSize),
  })

  const reviews = data?.data || []

  if (isLoading) {
    return (
      <Center py="10">
        <Spinner size="lg" color="purple.500" />
      </Center>
    )
  }

  if (reviews.length === 0) {
    return (
      <Box
        p="10"
        textAlign="center"
        borderWidth="1px"
        borderRadius="lg"
        bg="gray.50"
      >
        <Text color="gray.600">No reviews yet. Be the first to review this product!</Text>
      </Box>
    )
  }

  return (
    <VStack spacing="4" align="stretch">
      {reviews.map((review: ProductReview) => (
        <Box
          key={review.id}
          p="5"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="box-shadow 0.2s"
        >
          <VStack spacing="3" align="stretch">
            <HStack justify="space-between" align="flex-start">
              <VStack spacing="1" align="flex-start">
                <HStack>
                  <Text fontWeight="semibold">{review.reviewerName}</Text>
                  {review.isVerifiedPurchase && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap="1">
                      <FaCheckCircle size="10px" />
                      Verified Purchase
                    </Badge>
                  )}
                </HStack>
                <HStack>
                  <StarRating rating={review.rating} size="16px" />
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {review.reviewText && (
              <>
                <Divider />
                <Text color="gray.700" whiteSpace="pre-wrap">
                  {review.reviewText}
                </Text>
              </>
            )}
          </VStack>
        </Box>
      ))}

      {/* Pagination would go here if needed */}
      {reviews.length === pageSize && (
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          alignSelf="center"
        >
          Load More Reviews
        </Button>
      )}
    </VStack>
  )
}
