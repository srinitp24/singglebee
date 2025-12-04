import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Input,
  Select,
  Spinner,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { productService } from '../services/productService'
import { useCartStore } from '../store/cartStore'

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [language, setLanguage] = useState('')
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const toast = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, category, ageGroup, language, search],
    queryFn: () =>
      productService.getAll({
        page,
        pageSize: 12,
        category: category || undefined,
        ageGroup: ageGroup || undefined,
        language: language || undefined,
        search: search || undefined,
      }),
  })

  const addItem = useCartStore((state) => state.addItem)

  const getQuantity = (productId: string) => {
    return quantities[productId] || 1
  }

  const setQuantity = (productId: string, value: number) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    })
  }

  const handleAddToCart = async (product: any) => {
    const quantity = getQuantity(product.id)
    try {
      await addItem({
        id: product.id,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        productImageUrl: product.imageUrl,
        quantity: quantity,
        price: product.price,
        priceCents: product.priceCents,
        subtotal: product.price * quantity,
        subtotalCents: product.priceCents * quantity,
        availableStock: product.stock,
      })
      
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name}`,
        status: 'success',
        duration: 2000,
      })
      
      // Reset quantity to 1 after adding
      setQuantity(product.id, 1)
    } catch {
      toast({
        title: 'Failed to add to cart',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="6" align="stretch">
        <Heading>Products</Heading>

        {/* Filters */}
        <HStack spacing="4" flexWrap="wrap">
          <Input
            placeholder="Search products..."
            maxW="300px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            placeholder="All Categories"
            maxW="200px"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="activity-kits">Activity Kits</option>
            <option value="science-kits">Science Kits</option>
            <option value="learning-cards">Learning Cards</option>
            <option value="board-games">Board Games</option>
            <option value="books">Books</option>
            <option value="art-supplies">Art Supplies</option>
            <option value="robotics">Robotics</option>
          </Select>
          <Select
            placeholder="All Ages"
            maxW="150px"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="3-5">3-5 years</option>
            <option value="5-7">5-7 years</option>
            <option value="8-10">8-10 years</option>
          </Select>
          <Select
            placeholder="All Languages"
            maxW="150px"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
          </Select>
        </HStack>

        {/* Products Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="6">
          {data?.data.items.map((product) => (
            <Box
              key={product.id}
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <RouterLink to={`/products/${product.id}`}>
                <Image
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  h="200px"
                  w="full"
                  objectFit="cover"
                />
              </RouterLink>
              <Box p="4">
                <VStack align="stretch" gap="2">
                  <HStack justify="space-between">
                    <Badge colorScheme="purple">{product.category}</Badge>
                    <Text fontSize="sm" color="gray.500">
                      {product.ageGroup} years
                    </Text>
                  </HStack>
                  <RouterLink to={`/products/${product.id}`}>
                    <Heading size="sm" noOfLines={2}>
                      {product.name}
                    </Heading>
                  </RouterLink>
                  <Text fontSize="xl" fontWeight="bold" color="purple.600">
                    ₹{product.price.toFixed(2)}
                  </Text>
                  
                  {/* Quantity Selector */}
                  <HStack spacing="2">
                    <Text fontSize="sm" fontWeight="semibold">Qty:</Text>
                    <NumberInput
                      value={getQuantity(product.id)}
                      onChange={(_, value) => setQuantity(product.id, value)}
                      min={1}
                      max={product.stock}
                      maxW="100px"
                      size="sm"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                  
                  <Button
                    colorScheme="purple"
                    leftIcon={<FiShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                    isDisabled={product.stock === 0}
                    size="sm"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </VStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Pagination */}
        {data && data.data.totalPages > 1 && (
          <HStack justify="center" mt="8">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={!data.data.hasPreviousPage}
            >
              Previous
            </Button>
            <Text>
              Page {data.data.page} of {data.data.totalPages}
            </Text>
            <Button
              onClick={() => setPage((p) => p + 1)}
              isDisabled={!data.data.hasNextPage}
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  )
}
