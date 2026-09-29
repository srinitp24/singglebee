import { Box, VStack, HStack, Text, Progress, Divider } from '@chakra-ui/react'
import StarRating from './StarRating'
import type { ProductReviewSummary } from '../types/review'

interface RatingSummaryProps {
  summary: ProductReviewSummary
}

export default function RatingSummary({ summary }: RatingSummaryProps) {
  const getRatingPercentage = (count: number) => {
    return summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0
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
        <HStack justify="space-between" align="center">
          <VStack spacing="1" align="flex-start">
            <HStack>
              <Text fontSize="4xl" fontWeight="bold">
                {summary.averageRating.toFixed(1)}
              </Text>
              <StarRating rating={Math.round(summary.averageRating)} size="24px" />
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Based on {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
            </Text>
          </VStack>
        </HStack>

        <Divider />

        <VStack spacing="2" align="stretch">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.ratingDistribution[star] || 0
            const percentage = getRatingPercentage(count)
            
            return (
              <HStack key={star} spacing="3">
                <HStack spacing="1" minW="60px">
                  <Text fontSize="sm" fontWeight="medium">
                    {star}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    star{star !== 1 && 's'}
                  </Text>
                </HStack>
                <Progress
                  value={percentage}
                  size="sm"
                  colorScheme="yellow"
                  flex="1"
                  borderRadius="full"
                />
                <Text fontSize="sm" color="gray.600" minW="40px" textAlign="right">
                  {count}
                </Text>
              </HStack>
            )
          })}
        </VStack>
      </VStack>
    </Box>
  )
}
