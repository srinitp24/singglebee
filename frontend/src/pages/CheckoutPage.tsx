import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orderService } from '../services/orderService'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.postalCode || '',
    country: user?.country || 'India',
    // Payment Information (mock for now)
    paymentMethod: 'COD', // Cash on Delivery
    notes: '',
  })

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (response) => {
      clearCart()
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Order #${response.data.orderNumber} - Total: ₹${response.data.totalPrice.toFixed(2)}`,
        status: 'success',
        duration: 5000,
      })

      navigate('/orders')
    },
    onError: (error: unknown) => {
      console.error('Order creation error:', error)
      console.error('Error response:', (error as any)?.response?.data)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order'
      toast({
        title: 'Order Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePlaceOrder = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.country) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Validate address length
    if (formData.address.trim().length < 5) {
      toast({
        title: 'Invalid Address',
        description: 'Address must be at least 5 characters long',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const orderData = {
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingState: formData.state,
      shippingPostalCode: formData.pincode,
      shippingCountry: formData.country,
      notes: formData.notes || undefined,
    }

    console.log('Submitting order:', orderData)

    createOrderMutation.mutate(orderData)
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <Container maxW="7xl" py="16">
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Your cart is empty. Add some products before checking out.
        </Alert>
        <Button mt="4" colorScheme="purple" onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </Container>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxW="7xl" py="16">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Please login to continue with checkout.
        </Alert>
        <Button mt="4" colorScheme="purple" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" py="8">
      <Heading mb="6">Checkout</Heading>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
        {/* Checkout Form */}
        <GridItem>
          <Card variant="outline">
            <CardBody>
              <VStack spacing="6" align="stretch">
                <Box>
                  <Heading size="md" mb="4">Shipping Information</Heading>
                  
                  <VStack spacing="4">
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </FormControl>

                    <Grid templateColumns="repeat(2, 1fr)" gap="4" width="100%">
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                        />
                      </FormControl>
                    </Grid>

                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address, apartment, suite, etc."
                        rows={3}
                      />
                    </FormControl>

                    <Grid templateColumns="repeat(3, 1fr)" gap="4" width="100%">
                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Mumbai"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Maharashtra"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Pincode</FormLabel>
                        <Input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="400001"
                        />
                      </FormControl>
                    </Grid>

                    <FormControl isRequired>
                      <FormLabel>Country</FormLabel>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="India"
                      />
                    </FormControl>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Heading size="md" mb="4">Payment Method</Heading>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    Cash on Delivery (COD) only for now
                  </Alert>
                </Box>

                <Box>
                  <FormControl>
                    <FormLabel>Order Notes (Optional)</FormLabel>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                    />
                  </FormControl>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Order Summary */}
        <GridItem>
          <Card variant="outline" position="sticky" top="20">
            <CardBody>
              <Heading size="md" mb="4">Order Summary</Heading>
              
              <VStack spacing="3" align="stretch">
                {items.map((item) => (
                  <HStack key={item.productId} justify="space-between" fontSize="sm">
                    <Text flex="1">
                      {item.productName} × {item.quantity}
                    </Text>
                    <Text fontWeight="semibold">₹{item.subtotal.toFixed(2)}</Text>
                  </HStack>
                ))}

                <Divider />

                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
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
                  onClick={handlePlaceOrder}
                  isLoading={createOrderMutation.isPending}
                  loadingText="Placing Order..."
                >
                  Place Order
                </Button>

                <Button
                  variant="outline"
                  width="full"
                  onClick={() => navigate('/cart')}
                >
                  Back to Cart
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  )
}
