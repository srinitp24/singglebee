import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import StarRating from './StarRating'
import { reviewService } from '../services/reviewService'

interface ReviewFormProps {
  productId: string
  orderId: string
  productName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ReviewForm({ 
  productId, 
  orderId, 
  productName, 
  onSuccess,
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const toast = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => reviewService.createReview({
      productId,
      orderId,
      rating,
      reviewText: reviewText.trim() || undefined,
    }),
    onSuccess: () => {
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
      })
      // Invalidate product queries to refresh ratings
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', productId] })
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to submit review',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a star rating',
        status: 'warning',
        duration: 3000,
      })
      return
    }
    mutation.mutate()
  }

  return (
    <Box
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <VStack spacing="4" align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Write a Review for {productName}
        </Text>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Your review will be posted anonymously as a verified purchase.
        </Alert>

        <FormControl isRequired>
          <FormLabel>Your Rating</FormLabel>
          <StarRating
            rating={rating}
            size="28px"
            onChange={setRating}
            isInteractive
          />
        </FormControl>

        <FormControl>
          <FormLabel>Your Review (Optional)</FormLabel>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            maxLength={2000}
          />
          <Text fontSize="sm" color="gray.500" mt="1">
            {reviewText.length}/2000 characters
          </Text>
        </FormControl>

        <HStack spacing="3" justify="flex-end">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={mutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={mutation.isPending}
            loadingText="Submitting..."
          >
            Submit Review
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
