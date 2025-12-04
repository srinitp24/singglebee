import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Divider,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <Container maxW="7xl" py="16">
        <VStack spacing="6" textAlign="center" py="12">
          <FiShoppingBag size={80} color="gray" />
          <Heading size="lg" color="gray.600">Your cart is empty</Heading>
          <Text color="gray.500">Add some products to get started!</Text>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" py="8">
      <Heading mb="6">Shopping Cart</Heading>
      
      <Box display={{ base: 'block', lg: 'flex' }} gap="8">
        {/* Cart Items */}
        <Box flex="1">
          <VStack spacing="4" align="stretch">
            {items.map((item) => (
              <Card key={item.productId} variant="outline">
                <CardBody>
                  <HStack spacing="4" align="start">
                    {/* Product Image */}
                    <Box
                      flexShrink={0}
                      width={{ base: '80px', md: '120px' }}
                      height={{ base: '80px', md: '120px' }}
                      borderRadius="md"
                      overflow="hidden"
                      bg="gray.100"
                    >
                      <Image
                        src={item.productImageUrl || 'https://via.placeholder.com/120x120?text=Product'}
                        alt={item.productName}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    </Box>

                    {/* Product Details */}
                    <VStack flex="1" align="stretch" spacing="2">
                      <Heading size="md">{item.productName}</Heading>
                      <Text fontSize="sm" color="gray.600">SKU: {item.productSku}</Text>
                      <Text fontSize="xl" fontWeight="bold" color="purple.600">
                        ₹{item.price.toFixed(2)}
                      </Text>
                      
                      {/* Quantity Controls - Mobile/Desktop */}
                      <HStack spacing="4" mt="2">
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb="1">Quantity</Text>
                          <NumberInput
                            value={item.quantity}
                            onChange={(_, value) => updateQuantity(item.productId, value)}
                            min={1}
                            max={item.availableStock}
                            maxW="120px"
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>

                        <Box>
                          <Text fontSize="sm" color="gray.600" mb="1">Subtotal</Text>
                          <Text fontSize="lg" fontWeight="bold">
                            ₹{item.subtotal.toFixed(2)}
                          </Text>
                        </Box>
                      </HStack>

                      {item.quantity >= item.availableStock && (
                        <Alert status="warning" size="sm" borderRadius="md">
                          <AlertIcon />
                          Maximum stock reached
                        </Alert>
                      )}
                    </VStack>

                    {/* Remove Button */}
                    <IconButton
                      aria-label="Remove item"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeItem(item.productId)}
                    />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>

          {/* Clear Cart Button */}
          <Button
            mt="4"
            variant="outline"
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={clearCart}
            size="sm"
          >
            Clear Cart
          </Button>
        </Box>

        {/* Order Summary */}
        <Box
          width={{ base: '100%', lg: '400px' }}
          mt={{ base: '8', lg: '0' }}
        >
          <Card variant="outline" position="sticky" top="20">
            <CardBody>
              <Heading size="md" mb="4">Order Summary</Heading>
              
              <VStack spacing="3" align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Items ({totalItems})</Text>
                  <Text fontWeight="semibold">₹{totalPrice.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="semibold" color="green.600">FREE</Text>
                </HStack>

                <Divider />

                <HStack justify="space-between" fontSize="xl">
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold" color="purple.600">
                    ₹{totalPrice.toFixed(2)}
                  </Text>
                </HStack>

                <Button
                  colorScheme="purple"
                  size="lg"
                  width="full"
                  mt="4"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  width="full"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
