import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<any>({})
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const syncCart = useCartStore((state) => state.syncCart)

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      setAuth(data.data.user, data.data.token)
      
      // Clear any cached orders from previous user
      queryClient.clear()
      
      // Sync cart with backend after login
      try {
        await syncCart()
      } catch (error) {
        console.error('Failed to sync cart after login:', error)
      }
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      })
      navigate('/')
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email || !password) {
      setErrors({ email: !email, password: !password })
      return
    }

    loginMutation.mutate({ email, password })
  }

  return (
    <Container maxW="md" py="16">
      <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
        <VStack spacing="6" as="form" onSubmit={handleSubmit}>
          <Heading>Login</Heading>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <FormErrorMessage>Email is required</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <FormErrorMessage>Password is required</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
            isLoading={loginMutation.isPending}
          >
            Login
          </Button>

          <Text fontSize="sm">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="purple.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
