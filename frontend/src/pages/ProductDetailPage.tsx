import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { productService } from '../services/productService'
import { useCartStore } from '../store/cartStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  })

  const handleAddToCart = async () => {
    if (data?.data) {
      try {
        await addItem({
          id: data.data.id,
          productId: data.data.id,
          productName: data.data.name,
          productSku: data.data.sku,
          productImageUrl: data.data.imageUrl,
          quantity: quantity,
          price: data.data.price,
          priceCents: Math.round(data.data.price * 100),
          subtotal: data.data.price * quantity,
          subtotalCents: Math.round(data.data.price * quantity * 100),
          availableStock: data.data.stock,
        })
        toast({
          title: 'Added to cart',
          description: `${quantity} x ${data.data.name} added to your cart`,
          status: 'success',
          duration: 3000,
        })
      } catch {
        toast({
          title: 'Failed to add to cart',
          description: 'Please try again',
          status: 'error',
          duration: 3000,
        })
      }
    }
  }

  if (isLoading) {
    return (
      <Container maxW="7xl" py="16" textAlign="center">
        <Spinner size="xl" color="purple.500" />
        <Text mt="4">Loading product details...</Text>
      </Container>
    )
  }

  if (error || !data?.data) {
    return (
      <Container maxW="7xl" py="16">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Product not found or failed to load
        </Alert>
        <Button mt="4" onClick={() => navigate('/products')} colorScheme="purple">
          Back to Products
        </Button>
      </Container>
    )
  }

  const product = data.data

  return (
    <Container maxW="7xl" py="8">
      <Button mb="6" variant="ghost" onClick={() => navigate('/products')}>
        ← Back to Products
      </Button>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="8">
        <GridItem>
          <Box
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg="gray.50"
            height={{ base: '300px', md: '500px' }}
          >
            <Image
              src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Product+Image'}
              alt={product.name}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing="4">
            <Box>
              <Badge colorScheme="purple" fontSize="sm" mb="2">
                {product.category}
              </Badge>
              <Heading size="xl" mb="2">
                {product.name}
              </Heading>
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                ₹{product.price.toFixed(2)}
              </Text>
            </Box>

            <Box>
              <Heading size="sm" mb="2">Description</Heading>
              <Text color="gray.600">
                {product.description || 'No description available'}
              </Text>
            </Box>

            <Grid templateColumns="repeat(2, 1fr)" gap="4">
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                  SKU
                </Text>
                <Text>{product.sku}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                  Language
                </Text>
                <Text textTransform="capitalize">{product.language}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                  Age Group
                </Text>
                <Text>{product.ageGroup}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                  Stock
                </Text>
                <Badge colorScheme={product.stock > 0 ? 'green' : 'red'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </Badge>
              </Box>
            </Grid>

            <Box pt="4" borderTop="1px" borderColor="gray.200">
              <Text fontWeight="semibold" mb="3">Quantity</Text>
              <HStack spacing="4">
                <NumberInput
                  value={quantity}
                  onChange={(_, value) => setQuantity(value)}
                  min={1}
                  max={product.stock}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  colorScheme="purple"
                  size="lg"
                  flex="1"
                  onClick={handleAddToCart}
                  isDisabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </HStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  )
}

