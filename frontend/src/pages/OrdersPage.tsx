import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Container,
  Heading,
  VStack,
  Card,
  CardBody,
  Text,
  HStack,
  Badge,
  Button,
  Box,
  Divider,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { FiPackage, FiEye } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { orderService } from '../services/orderService'
import type { OrderDto } from '../services/orderService'

const statusColors: Record<string, string> = {
  pending: 'yellow',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const toast = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: orderService.getMyOrders,
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <Container maxW="7xl" py="16" display="flex" justifyContent="center">
        <Spinner size="xl" color="purple.500" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="7xl" py="16">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Failed to load orders. Please try again later.
        </Alert>
      </Container>
    )
  }

  const orders = data?.data || []

  if (orders.length === 0) {
    return (
      <Container maxW="7xl" py="16">
        <VStack spacing="6">
          <FiPackage size="64" color="gray" />
          <Heading size="lg" color="gray.600">
            No Orders Yet
          </Heading>
          <Text color="gray.500">
            You haven't placed any orders. Start shopping to see your orders here.
          </Text>
          <Button colorScheme="purple" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="6" align="stretch">
        <Heading>My Orders</Heading>

        {orders.map((order: OrderDto) => (
          <Card key={order.id} variant="outline">
            <CardBody>
              <VStack spacing="4" align="stretch">
                {/* Order Header */}
                <HStack justify="space-between" flexWrap="wrap" gap="2">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      Order #{order.orderNumber}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Box>
                  <HStack>
                    <Badge
                      colorScheme={statusColors[order.status] || 'gray'}
                      fontSize="md"
                      px="3"
                      py="1"
                      borderRadius="full"
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                    <Badge
                      colorScheme={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                      fontSize="md"
                      px="3"
                      py="1"
                      borderRadius="full"
                    >
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </HStack>
                </HStack>

                <Divider />

                {/* Order Items */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3">
                  {order.items.map((item) => (
                    <HStack key={item.id} spacing="3">
                      <Box flex="1">
                        <Text fontWeight="semibold">{item.productName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </Text>
                      </Box>
                      <Text fontWeight="bold">₹{item.subtotal.toFixed(2)}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>

                <Divider />

                {/* Order Summary */}
                <HStack justify="space-between" flexWrap="wrap" gap="4">
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Shipping Address
                    </Text>
                    <Text fontSize="sm">{order.shippingAddress}</Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="sm" color="gray.600">
                      Total Amount
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      ₹{order.totalPrice.toFixed(2)}
                    </Text>
                  </Box>
                </HStack>

                {/* Actions */}
                <HStack spacing="3" pt="2">
                  <Button
                    leftIcon={<FiEye />}
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="sm"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          try {
                            await orderService.cancelOrder(order.id)
                            toast({
                              title: 'Order cancelled',
                              status: 'success',
                              duration: 3000,
                            })
                            window.location.reload()
                          } catch {
                            toast({
                              title: 'Failed to cancel order',
                              status: 'error',
                              duration: 3000,
                            })
                          }
                        }
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Container>
  )
}
