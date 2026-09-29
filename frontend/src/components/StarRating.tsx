import { Box, HStack, Icon } from '@chakra-ui/react'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface StarRatingProps {
  rating: number
  size?: string
  color?: string
  onChange?: (rating: number) => void
  isInteractive?: boolean
}

export default function StarRating({ 
  rating, 
  size = '20px', 
  color = 'yellow.400',
  onChange,
  isInteractive = false 
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <HStack spacing="1">
      {stars.map((star) => (
        <Box
          key={star}
          cursor={isInteractive ? 'pointer' : 'default'}
          onClick={() => isInteractive && onChange?.(star)}
          _hover={isInteractive ? { transform: 'scale(1.1)' } : {}}
          transition="transform 0.2s"
        >
          <Icon
            as={star <= rating ? FaStar : FaRegStar}
            color={star <= rating ? color : 'gray.300'}
            boxSize={size}
          />
        </Box>
      ))}
    </HStack>
  )
}
