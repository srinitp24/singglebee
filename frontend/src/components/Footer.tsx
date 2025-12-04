import { Box, Container, Text, HStack, Link } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box bg="gray.800" color="white" py="8" mt="auto">
      <Container maxW="7xl">
        <HStack justifyContent="space-between" flexWrap="wrap">
          <Text fontSize="sm">© 2025 SINGGLEBEE. Educational products for kids.</Text>
          <HStack gap="6">
            <Link href="#" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
              About
            </Link>
            <Link href="#" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
              Contact
            </Link>
            <Link href="#" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
              Privacy
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
