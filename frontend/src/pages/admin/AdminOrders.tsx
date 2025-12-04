import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  Box,
  Text,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { FiEye } from 'react-icons/fi'
import { orderService } from '../../services/orderService'
import type { OrderDto } from '../../services/orderService'

const statusColors: Record<string, string> = {
  created: 'gray',
  pending: 'yellow',
  pending_payment: 'orange',
  paid: 'green',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'pink',
}

const statusOptions = [
  'created',
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export default function AdminOrders() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: orderService.getAllOrders,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      orderService.updateOrderStatus(id, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
      toast({
        title: 'Order status updated',
        status: 'success',
        duration: 3000,
      })
      onClose()
      setSelectedOrder(null)
      setNewStatus('')
      setStatusNotes('')
    },
    onError: () => {
      toast({
        title: 'Failed to update order status',
        status: 'error',
        duration: 3000,
      })
    },
  })

  const handleUpdateStatus = (order: OrderDto) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setStatusNotes('')
    onOpen()
  }

  const handleSaveStatus = () => {
    if (!selectedOrder || !newStatus) return

    updateStatusMutation.mutate({
      id: selectedOrder.id,
      status: newStatus,
      notes: statusNotes || undefined,
    })
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

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="6" align="stretch">
        <HStack justify="space-between">
          <Heading>Manage Orders</Heading>
          <Badge fontSize="lg" px="3" py="1" borderRadius="full">
            {orders.length} Total Orders
          </Badge>
        </HStack>

        {orders.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            No orders found.
          </Alert>
        ) : (
          <Box overflowX="auto" borderWidth="1px" borderRadius="lg">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Order #</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order: OrderDto) => (
                  <Tr key={order.id}>
                    <Td fontWeight="semibold">{order.orderNumber}</Td>
                    <Td>
                      <Box>
                        <Text fontWeight="medium">{order.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {order.customerEmail}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{order.items.length} items</Td>
                    <Td fontWeight="bold">₹{order.totalPrice.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={statusColors[order.status] || 'gray'}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                    </Td>
                    <Td fontSize="sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </Td>
                    <Td>
                      <HStack spacing="2">
                        <Button
                          size="sm"
                          leftIcon={<FiEye />}
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => {
                            // TODO: Navigate to order details page
                            toast({
                              title: 'Order Details',
                              description: `Viewing order ${order.orderNumber}`,
                              status: 'info',
                              duration: 2000,
                            })
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="purple"
                          onClick={() => handleUpdateStatus(order)}
                        >
                          Update
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>

      {/* Update Status Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update Order Status
            {selectedOrder && (
              <Text fontSize="sm" fontWeight="normal" color="gray.600" mt="1">
                Order #{selectedOrder.orderNumber}
              </Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.toUpperCase().replace('_', ' ')}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Notes (Optional)</FormLabel>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSaveStatus}
              isLoading={updateStatusMutation.isPending}
            >
              Update Status
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}
