import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi'
import { productService } from '../../services/productService'

export default function AdminDashboard() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAll({ page: 1, pageSize: 100 }),
  })

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  const products = productsData?.data.items || []
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStockProducts = products.filter(p => p.stock < 10).length

  return (
    <Container maxW="7xl" py="8">
      <VStack spacing="8" align="stretch">
        <Box>
          <Heading mb="2">Admin Dashboard</Heading>
          <Text color="gray.600">Overview of your store</Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6">
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg="purple.100"
                    color="purple.600"
                  >
                    <FiPackage size={24} />
                  </Box>
                  <Box flex="1">
                    <StatLabel>Total Products</StatLabel>
                    <StatNumber>{totalProducts}</StatNumber>
                    <StatHelpText>Active products</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg="blue.100"
                    color="blue.600"
                  >
                    <FiShoppingBag size={24} />
                  </Box>
                  <Box flex="1">
                    <StatLabel>Total Stock</StatLabel>
                    <StatNumber>{totalStock}</StatNumber>
                    <StatHelpText>Units in inventory</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg="green.100"
                    color="green.600"
                  >
                    <FiDollarSign size={24} />
                  </Box>
                  <Box flex="1">
                    <StatLabel>Inventory Value</StatLabel>
                    <StatNumber fontSize="lg">₹{totalValue.toFixed(0)}</StatNumber>
                    <StatHelpText>Total stock value</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg="orange.100"
                    color="orange.600"
                  >
                    <FiUsers size={24} />
                  </Box>
                  <Box flex="1">
                    <StatLabel>Low Stock Alert</StatLabel>
                    <StatNumber>{lowStockProducts}</StatNumber>
                    <StatHelpText>Products {'<'} 10 units</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <Heading size="md" mb="4">Quick Actions</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
              <Button
                as={RouterLink}
                to="/admin/products"
                colorScheme="purple"
                size="lg"
                leftIcon={<FiPackage />}
              >
                Manage Products
              </Button>
              <Button
                as={RouterLink}
                to="/admin/orders"
                colorScheme="blue"
                size="lg"
                leftIcon={<FiShoppingBag />}
              >
                View Orders
              </Button>
              <Button
                as={RouterLink}
                to="/products"
                variant="outline"
                size="lg"
              >
                View Store
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Low Stock Products */}
        {lowStockProducts > 0 && (
          <Card>
            <CardBody>
              <Heading size="md" mb="4">Low Stock Alert</Heading>
              <VStack align="stretch" spacing="2">
                {products
                  .filter(p => p.stock < 10)
                  .slice(0, 5)
                  .map(product => (
                    <HStack key={product.id} justify="space-between" p="2" bg="orange.50" borderRadius="md">
                      <Text fontWeight="semibold">{product.name}</Text>
                      <HStack>
                        <Text color="orange.600" fontWeight="bold">{product.stock} units</Text>
                        <Button
                          as={RouterLink}
                          to={`/admin/products?edit=${product.id}`}
                          size="sm"
                          colorScheme="orange"
                          variant="outline"
                        >
                          Restock
                        </Button>
                      </HStack>
                    </HStack>
                  ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  )
}
