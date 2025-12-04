import { Container, Heading, Text, Button, Box, SimpleGrid, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-r, purple.500, pink.500)"
        color="white"
        py="20"
      >
        <Container maxW="7xl">
          <VStack spacing="6" textAlign="center">
            <Heading size="3xl">Welcome to SINGGLEBEE</Heading>
            <Text fontSize="xl" maxW="2xl">
              Educational products and learning materials for kids. From activity kits to books,
              we make learning fun!
            </Text>
            <Button
              as={RouterLink}
              to="/products"
              size="lg"
              colorScheme="whiteAlpha"
              variant="outline"
            >
              Browse Products
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py="16">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="8">
          <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb="4">📚 Quality Products</Heading>
            <Text color="gray.600">
              Curated educational materials designed to make learning engaging and effective.
            </Text>
          </Box>
          <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb="4">🌍 Multi-Language</Heading>
            <Text color="gray.600">
              Support for multiple languages including English, Hindi, and Telugu.
            </Text>
          </Box>
          <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb="4">🎯 Age-Appropriate</Heading>
            <Text color="gray.600">
              Products categorized by age groups to ensure perfect developmental fit.
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
