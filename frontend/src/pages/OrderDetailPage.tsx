import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
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
  Grid,
  GridItem,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { FiArrowLeft, FiPackage } from 'react-icons/fi'
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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const toast = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: isAuthenticated && !!id,
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
          Failed to load order details. Please try again later.
        </Alert>
        <Button mt="4" leftIcon={<FiArrowLeft />} onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Container>
    )
  }

  const order: OrderDto = data?.data

  if (!order) {
    return (
      <Container maxW="7xl" py="16">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Order not found
        </Alert>
        <Button mt="4" leftIcon={<FiArrowLeft />} onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="6" align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>

        {/* Order Header */}
        <Card variant="outline">
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap="6">
              <GridItem>
                <VStack align="stretch" spacing="3">
                  <HStack>
                    <FiPackage size="24" />
                    <Heading size="lg">Order #{order.orderNumber}</Heading>
                  </HStack>
                  <Text color="gray.600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align={{ base: 'flex-start', md: 'flex-end' }} spacing="3">
                  <HStack spacing="3">
                    <Badge
                      colorScheme={statusColors[order.status] || 'gray'}
                      fontSize="md"
                      px="4"
                      py="2"
                      borderRadius="full"
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                    <Badge
                      colorScheme={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                      fontSize="md"
                      px="4"
                      py="2"
                      borderRadius="full"
                    >
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </HStack>
                  <Box textAlign={{ base: 'left', md: 'right' }}>
                    <Text fontSize="sm" color="gray.600">
                      Total Amount
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                      ₹{order.totalPrice.toFixed(2)}
                    </Text>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Order Items */}
        <Card variant="outline">
          <CardBody>
            <Heading size="md" mb="4">
              Order Items
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th>SKU</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Subtotal</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {order.items.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="semibold">{item.productName}</Td>
                      <Td color="gray.600">{item.productSku}</Td>
                      <Td isNumeric>₹{item.price.toFixed(2)}</Td>
                      <Td isNumeric>{item.quantity}</Td>
                      <Td isNumeric fontWeight="bold">
                        ₹{item.subtotal.toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Divider my="4" />

            <HStack justify="flex-end" spacing="8">
              <Box textAlign="right">
                <Text fontSize="sm" color="gray.600">
                  Subtotal
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                  ₹{order.totalPrice.toFixed(2)}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="sm" color="gray.600">
                  Total
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  ₹{order.totalPrice.toFixed(2)}
                </Text>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Customer & Shipping Information */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          {/* Customer Information */}
          <Card variant="outline">
            <CardBody>
              <Heading size="md" mb="4">
                Customer Information
              </Heading>
              <VStack align="stretch" spacing="2">
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Name
                  </Text>
                  <Text fontWeight="semibold">{order.customerName}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Email
                  </Text>
                  <Text fontWeight="semibold">{order.customerEmail}</Text>
                </Box>
                {order.customerPhone && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Phone
                    </Text>
                    <Text fontWeight="semibold">{order.customerPhone}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Shipping Information */}
          <Card variant="outline">
            <CardBody>
              <Heading size="md" mb="4">
                Shipping Address
              </Heading>
              <VStack align="stretch" spacing="2">
                <Text fontWeight="semibold">{order.shippingAddress}</Text>
                {order.shippingCity && (
                  <Text>
                    {order.shippingCity}, {order.shippingState}{' '}
                    {order.shippingPostalCode}
                  </Text>
                )}
                {order.shippingCountry && (
                  <Text>{order.shippingCountry}</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Notes */}
        {order.notes && (
          <Card variant="outline">
            <CardBody>
              <Heading size="md" mb="3">
                Order Notes
              </Heading>
              <Text color="gray.700">{order.notes}</Text>
            </CardBody>
          </Card>
        )}

        {/* Cancel Order */}
        {order.status === 'pending' && (
          <Card variant="outline" borderColor="red.200">
            <CardBody>
              <HStack justify="space-between" flexWrap="wrap" gap="4">
                <Box>
                  <Heading size="sm" mb="1">
                    Cancel Order
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    You can cancel this order if it hasn't been processed yet
                  </Text>
                </Box>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      try {
                        await orderService.cancelOrder(order.id)
                        toast({
                          title: 'Order cancelled',
                          status: 'success',
                          duration: 3000,
                        })
                        navigate('/orders')
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
              </HStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  )
}
