import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Flex, Button, HStack, Badge, IconButton, Link, Text, Heading } from '@chakra-ui/react'
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const totalItems = useCartStore((state) => state.totalItems)

  return (
    <Box 
      bg="rgba(255, 255, 255, 0.95)" 
      backdropFilter="blur(10px)"
      boxShadow="0 2px 20px rgba(0, 0, 0, 0.05)" 
      position="sticky" 
      top="0" 
      zIndex="sticky"
    >
      <Container maxW="7xl" py="3">
        <Flex alignItems="center" justifyContent="space-between">
          <Link 
            as={RouterLink} 
            to="/" 
            _hover={{ textDecoration: 'none' }}
          >
            <Box>
              <Heading 
                as="h1" 
                size="lg"
                fontFamily="'Poppins', sans-serif"
                fontWeight="800"
                color="#6366f1"
                letterSpacing="-0.5px"
                position="relative"
                overflow="hidden"
                sx={{
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: '3px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    transition: 'width 0.5s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  }
                }}
              >
                SINGGLE<Box as="span" color="#10b981">BEE</Box>
              </Heading>
              <Text 
                fontSize="0.85rem" 
                color="#64748b" 
                mt="2px" 
                fontWeight="500"
              >
                Glow and Growth Assured
              </Text>
            </Box>
          </Link>

          <HStack spacing="4">
            <Link as={RouterLink} to="/products">
              <Button variant="ghost">Products</Button>
            </Link>

            {isAuthenticated && (
              <Link as={RouterLink} to="/orders">
                <Button variant="ghost">Orders</Button>
              </Link>
            )}

            {isAuthenticated && isAdmin() && (
              <Link as={RouterLink} to="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}

            <Link as={RouterLink} to="/cart">
              <Box position="relative" display="inline-block">
                <IconButton 
                  aria-label="Cart" 
                  icon={<FiShoppingCart />} 
                  variant="ghost"
                />
                {totalItems > 0 && (
                  <Badge
                    position="absolute"
                    top="-4px"
                    right="-4px"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Box>
            </Link>

            {isAuthenticated ? (
              <HStack spacing="2">
                <Link as={RouterLink} to="/profile">
                  <Button variant="ghost" leftIcon={<FiUser />}>
                    {user?.name}
                  </Button>
                </Link>
                <IconButton
                  aria-label="Logout"
                  icon={<FiLogOut />}
                  variant="ghost"
                  onClick={logout}
                />
              </HStack>
            ) : (
              <HStack spacing="2">
                <Link as={RouterLink} to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link as={RouterLink} to="/register">
                  <Button colorScheme="purple">Sign Up</Button>
                </Link>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
