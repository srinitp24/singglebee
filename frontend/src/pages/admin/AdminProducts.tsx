import { useState } from 'react'
import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  HStack,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useToast,
  Spinner,
  Center,
  Badge,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
} from '@chakra-ui/react'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { productService } from '../../services/productService'
import { useAuthStore } from '../../store/authStore'

interface ProductFormData {
  name: string
  sku: string
  description: string
  price: number
  stock: number
  category: string
  ageGroup: string
  language: string
  imageUrl: string
  currency: string
  rating: number
  isActive: boolean
}

export default function AdminProducts() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const authStore = useAuthStore()
  
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    ageGroup: '',
    language: '',
    imageUrl: '',
    currency: 'INR',
    rating: 0,
    isActive: true,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products-list'],
    queryFn: () => productService.getAll({ page: 1, pageSize: 100 }),
  })

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Product created successfully',
        status: 'success',
        duration: 3000,
      })
      handleCloseModal()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product'
      const validationErrors = error.response?.data?.errors
      
      toast({
        title: 'Failed to create product',
        description: validationErrors ? validationErrors.join(', ') : errorMessage,
        status: 'error',
        duration: 5000,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Product updated successfully',
        status: 'success',
        duration: 3000,
      })
      handleCloseModal()
    },
    onError: () => {
      toast({
        title: 'Failed to update product',
        status: 'error',
        duration: 3000,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Product deleted successfully',
        status: 'success',
        duration: 3000,
      })
    },
    onError: () => {
      toast({
        title: 'Failed to delete product',
        status: 'error',
        duration: 3000,
      })
    },
  })

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      ageGroup: '',
      language: '',
      imageUrl: '',
      currency: 'INR',
      rating: 0,
      isActive: true,
    })
    onOpen()
  }

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      ageGroup: product.ageGroup || '',
      language: product.language || '',
      imageUrl: product.imageUrl || '',
      currency: product.currency || 'INR',
      rating: product.rating || 0,
      isActive: product.isActive ?? true,
    })
    onOpen()
  }

  const handleCloseModal = () => {
    setEditingProduct(null)
    onClose()
  }

  const handleSubmit = () => {
    // Clean up data - remove empty strings for optional fields
    const cleanedData: any = {
      name: formData.name,
      sku: formData.sku,
      price: formData.price,
      stock: formData.stock,
      currency: formData.currency,
      rating: formData.rating,
      isActive: formData.isActive,
    }
    
    // Only add optional fields if they have values
    if (formData.description) cleanedData.description = formData.description
    if (formData.category) cleanedData.category = formData.category
    if (formData.ageGroup) cleanedData.ageGroup = formData.ageGroup
    if (formData.language) cleanedData.language = formData.language
    if (formData.imageUrl) cleanedData.imageUrl = formData.imageUrl
    
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: cleanedData })
    } else {
      createMutation.mutate(cleanedData)
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeletingProductId(id)
    onDeleteOpen()
  }

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      deleteMutation.mutate(deletingProductId)
    }
    onDeleteClose()
    setDeletingProductId(null)
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  const products = data?.data.items || []

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="6" align="stretch">
        <HStack justify="space-between">
          <Heading>Manage Products</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="purple"
            onClick={handleOpenCreate}
          >
            Add Product
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>SKU</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td fontFamily="mono" fontSize="sm">{product.sku}</Td>
                  <Td fontWeight="semibold">{product.name}</Td>
                  <Td>
                    <Badge colorScheme="purple">{product.category}</Badge>
                  </Td>
                  <Td>₹{product.price.toFixed(2)}</Td>
                  <Td>
                    <Badge colorScheme={product.stock > 10 ? 'green' : 'orange'}>
                      {product.stock} units
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={product.isActive ? 'green' : 'red'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing="2">
                      <IconButton
                        aria-label="Edit"
                        icon={<FiEdit />}
                        size="sm"
                        onClick={() => handleOpenEdit(product)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(product.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </FormControl>

              <HStack width="100%" spacing="4">
                <FormControl isRequired>
                  <FormLabel>Price (₹)</FormLabel>
                  <NumberInput
                    value={formData.price}
                    onChange={(_, value) => setFormData({ ...formData, price: value })}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput
                    value={formData.stock}
                    onChange={(_, value) => setFormData({ ...formData, stock: value })}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="activity-kits">Activity Kits</option>
                  <option value="science-kits">Science Kits</option>
                  <option value="learning-cards">Learning Cards</option>
                  <option value="board-games">Board Games</option>
                  <option value="books">Books</option>
                </Select>
              </FormControl>

              <HStack width="100%" spacing="4">
                <FormControl>
                  <FormLabel>Age Group</FormLabel>
                  <Select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  >
                    <option value="">Select Age</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-7">5-7 years</option>
                    <option value="8-10">8-10 years</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Are you sure you want to delete this product? This action will{' '}
                <Text as="span" fontWeight="bold" color="red.500">
                  permanently remove
                </Text>{' '}
                the product from the database and cannot be undone.
              </Text>
              <Text mt="3" fontSize="sm" color="gray.600">
                Note: If this product was part of the initial seeded data, you will need to
                reset the database to restore it.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}
